from flask import Flask, render_template, redirect, jsonify, 
request, session, abort,send_from_directory, send_file
from flask_pymongo import PyMongo
from bson import ObjectId
import json
import os
import csv

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo_bikes = PyMongo(app, uri="mongodb://localhost:27017/NCBikes_app")
mongo_pedes = PyMongo(app, uri="mongodb://localhost:27017/NCPedestrians_app")

# Route to render index.html template using data from Mongo
@app.route("/", methods=["GET", "POST"])
def home():

    # Find one record of data from the mongo database
    bikes_data = mongo_bikes.db.collection.find()
    pedes_data = mongo_pedes.db.collection.find()

    # x1_axis = bikes_data['CrashSevr']
    # y1_axis = bikes_data['County']
    # x2_axis = pedes_data['CrashSevr']
    # y2_axis = pedes_data['County']


    # Return template and data
    return render_template("index.html", article1=bikes_data, article2=pedes_data)


# Route that will trigger the scrape function
@app.route("/read_bikes", methods=["GET", "POST"])
def read_bikes():
    mongo_bikes.db.collection.drop()
    data_path = '/Users/grinn/UCBWork/Safety_NC/data/bicycles_selcols_v1.csv'
    
    # bdata = []
    # bikedata = []
    output = {}

    with open(data_path) as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")
        csv_header = next (csvreader)

        for row in csvreader:  
            bike_row = row
            bikes = {}
            for i in range(len(csv_header)):
                bikes.update( {csv_header[i] : bike_row[i]} )
                       
            mongo_bikes.db.collection.insert_one(bikes)
#            bikedata.append(bikes)

    # class JSONEncoder(json.JSONEncoder):
    #     def default(self, o):
    #         if isinstance(o, ObjectId):
    #             return str(o)
    #         return json.JSONEncoder.default(self, o)

#    bikedata = json.dumps(bikedata, cls=JSONEncoder)

    bikes_results = mongo_bikes.db.collection.find()
    #bdata = list(bikes_results)
    for result in bikes_results: 
        geo_point = result['geo_point_2d']
        age = result['Age']
        crash_sevr = result['CrashSevr']
        age_group = result['BikeAgeGrp']
        sex = result['BikeSex']
        city = result['City']
        county = result['County']
        hour = result['CrashHour']
        day_of_week = result['Day of Week']
        month = result['CrashMonth']
        year = result['CrashYear']
        speed_limit = result['SpeedLimit_upper_value']
        output.update( {geo_point : (age, age_group, sex, crash_sevr, city, county, hour, day_of_week, month, year, speed_limit)} )
    

        # res = json.dumps(result, cls=JSONEncoder)
        # bdata.append(res)
    print("length of output: ", len(output))

    return jsonify(output)

@app.route("/read_pedestrians", methods=["GET", "POST"])
def read_pedestrians():
    mongo_pedes.db.collection.drop()
    data_path = '/Users/grinn/UCBWork/Safety_NC/data/pedestrian_selcols_v1.csv'
    
    output = {}

    with open(data_path) as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")
        csv_header = next (csvreader)

        for row in csvreader:  
            pedes_row = row
            pedes = {}
            for i in range(len(csv_header)):
                pedes.update( {csv_header[i] : pedes_row[i]} )
                       
            mongo_pedes.db.collection.insert_one(pedes)

    pedes_results = mongo_pedes.db.collection.find()
    
    for result in pedes_results: 
        geo_point = result['geo_point_2d']
        age = result['Age']
        crash_sevr = result['CrashSevr']
        age_group = result['PedAgeGrp']
        sex = result['PedSex']
        city = result['City']
        county = result['County']
        hour = result['CrashHour']
        day_of_week = result['Day of Week']
        month = result['CrashMonth']
        year = result['CrashYear']
        speed_limit = result['SpeedLimit_upper_value']
        output.update( {geo_point : (age, age_group, sex, crash_sevr, city, county, hour, day_of_week, month, year, speed_limit)} )
        
    print("length of output: ", len(output))

    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)

