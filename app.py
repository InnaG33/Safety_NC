from flask import Flask, render_template, redirect, jsonify
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
# @app.route("/")
# def home():

#     # Find one record of data from the mongo database
#     bikes_data = mongo_bikes.db.collection.find()
#     pedes_data = mongo_pedes.db.collection.find()

#     # Return template and data
#     return render_template("index_bikes.html", article1=bikes_data, article2=pedes_data)

@app.route("/")
def welcome():
    """List all available api routes."""
    return render_template("welcome.html")

@app.route("/pedes_chart")
def pedes_chart():

    # Find one record of data from the mongo database
    # bikes_data = mongo_bikes.db.collection.find()
    pedes_data = mongo_pedes.db.collection.find()

    # Return template and data
    return render_template("index_peds.html", article2=pedes_data)

@app.route("/bikes_chart")
def bikes_chart():

    # Find one record of data from the mongo database
    bikes_data = mongo_bikes.db.collection.find()
    # pedes_data = mongo_pedes.db.collection.find()

    # Return template and data
    return render_template("index_bikes.html", article1=bikes_data)


@app.route("/read_bikes")
def read_bikes():
    mongo_bikes.db.collection.drop()
    data_path = '/Users/grinn/UCBWork/Safety_NC/data/sevr_killed_bikes.csv'
    
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

    bikes_results = mongo_bikes.db.collection.find()

    for result in bikes_results: 
        county = result['County']
        year = result['CrashYear']
        age = result['Age']
        crashour = result['CrashHour']
        day_of_week = result['Day of Week']
        month = result['CrashMonth']
        speed_limit = result['SpeedLimit_upper_value']
        output.update( {county : (year, month, day_of_week, crashour, speed_limit, age)} )

    print("length of output: ", len(output))

    return jsonify(output)

@app.route("/read_pedestrians")
def read_pedestrians():
    mongo_pedes.db.collection.drop()
    data_path = '/Users/grinn/UCBWork/Safety_NC/data/sevr_killed_pedes.csv'
    
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
        age = result['Age']
        county = result['County']
        crashour = result['CrashHour']
        day_of_week = result['Day of Week']
        month = result['CrashMonth']
        year = result['CrashYear']
        speed_limit = result['SpeedLimit_upper_value']
        output.update( {county : (year, month, day_of_week, crashour, speed_limit, age)} )
        
    print("length of output: ", len(output))

    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)

