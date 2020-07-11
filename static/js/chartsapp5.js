
var filterType = d3.select("#filters");
var chosenElement = filterType.property("value");

// Select the button
var button = d3.select("#filter-btn");

var svgWidth = 770;
var svgHeight = 590;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 10,
  bottom: 150,
  left: 50
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var id2 = "#bikes";
var id1 = "#pedes";

function buildPlot(Data, id) {

  d3.select("svg").remove();

  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
  
  // Select body, append SVG area to it, and set the dimensions
  var svg = d3.select(id)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
  
  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  
  let entries = Object.entries(Data);

  var xBandScale = d3.scaleBand()
  .domain(entries.map(([prop, vals])=> prop))
  .range([0, chartWidth])
  .padding(0.1);

  var max_d = d3.max(entries.map( ([prop, vals]) => vals[5]));
  var add_to_max_d = 0.1 * (d3.max(entries.map( ([prop, vals]) => vals[5])));
  var max_domain = 0.11*(max_d + add_to_max_d);
  console.log(max_domain);
// Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
  .domain([0, max_domain])
  .range([chartHeight, 0]);

// Create two new functions passing our scales in as arguments
// These will be used to create the chart's axes
var bottomAxis = d3.axisBottom(xBandScale);
var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

// Append two SVG group elements to the chartGroup area,
// and create the bottom and left axes inside of them
chartGroup.append("g")
  .call(leftAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .style("font-size", "14");

chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .style("font-size", "14")
  .attr("transform", "rotate(-60)");

chartGroup.selectAll(id)
  .data(entries)
  .enter()
  .append("circle")
  .attr("cx", ([prop, vals]) => xBandScale(prop))
  .attr("cy", ([prop, vals]) => yLinearScale(vals[5]))
  .attr("r", ([prop, vals]) => vals[5]*0.5)
  .attr("fill", "blue")
  .attr("opacity", "0.55");

  var textGroup = chartGroup.selectAll("text.testing")
    .data(entries)
    .enter()
    .append("text")
    .attr("class", "testing")
    .attr("dx", ([prop, vals]) => xBandScale(prop))
    .attr("dy", ([prop, vals]) => yLinearScale(vals[5]))
    .text(([prop, vals]) => `${vals[4]} mph`);

    // Create group for three x-axis labels
  var labelsGroupX = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var countyLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 80)
  .attr("value", "County") // value to grab for event listener
  .classed("active", true)
  .text("County");

  var labelsGroupY = chartGroup.append("g");

  var ageLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -45)
  .attr("x",  0 - (chartHeight / 2))
  .attr("dy", "1em")
  .attr("value", "Age") // value to grab for event listener
  .classed("active", true)
  .text("Age (years)"); 
}

function runEnter(Data, id) {
  
  var filteredData = Data;

  // Prevent the page from refreshing
  d3.event.preventDefault();

  var inputElement = d3.select("#year");
  // Get the value property of the input element
  var inputValue = inputElement.property("value");
  let entries = Object.entries(filteredData);

  if (inputValue) {
      filteredData = Object.fromEntries(entries.filter(([prop, vals]) => vals[0] === inputValue));
      entries = Object.entries(filteredData); 
      console.log('year-filtered');
  }

  var inputElement = d3.select("#country");
  var inputValue = inputElement.property("value");

  if (inputValue) {
      filteredData = Object.fromEntries(entries.filter(([prop, vals]) => prop === inputValue));
      entries = Object.entries(filteredData);  
      console.log('county-filtered');
  }

  var inputElement = d3.select("#month");
  var inputValue = inputElement.property("value");

  if (inputValue) {
      filteredData = Object.fromEntries(entries.filter(([prop, vals]) => vals[1] === inputValue));
      entries = Object.entries(filteredData);  
      console.log('month-filtered'); 
  }

  var inputElement = d3.select("#dayweek");
  var inputValue = inputElement.property("value");

  if (inputValue) {
      filteredData = Object.fromEntries(entries.filter(([prop, vals]) => vals[2] === inputValue));
      entries = Object.entries(filteredData);
      console.log('weekday-filtered');
  }
buildPlot(filteredData, id);  

}
function findIndex (chosenAxis){
  index = 0;
  if (chosenAxis === "Age") {
    index = 5;
  }
  if (chosenAxis === "Speed_Limit_UL") {
    index = 4;
  }
  if (chosenAxis === "Crash_hour") {
    index = 3;
  }
  return index;
}
// function used for updating x-scale var upon click on axis label
function xScale(Data) {
  // create scales
  
  let entries = Object.entries(Data);
  var xBandScale = d3.scaleBand()
    .domain(entries.map(([prop, vals])=> prop))
    .range([0, chartWidth])
    .padding(0.1);
  
  return xBandScale;
}

function yScale(Data, chosenYAxis) {
  // create scales
  let entries = Object.entries(Data);
  index = findIndex(chosenYAxis);

  var max_d = d3.max(entries.map( ([prop, vals]) => vals[index]));
  var add_to_max_d = 0.1 * (d3.max(entries.map( ([prop, vals]) => vals[index])));
  var max_domain = 0.11*(max_d + add_to_max_d);

  var yLinearScale = d3.scaleLinear()
  .domain([0, max_domain])
  .range([chartHeight, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Define dimensions of the chart area

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select(id1)
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.json("/read_pedestrians").then(function(Data) {
  
  console.log(Data);
  button.on("click", ()=>runEnter(Data, id1));

  let entries = Object.entries(Data);

  var chosenXAxis = "County";
  var chosenYAxis = "Age";
  index_y = findIndex(chosenYAxis);

  var xBandScale = xScale(Data, chosenXAxis);
  var yLinearScale = yScale(Data, chosenYAxis);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks();

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  var yAxis = chartGroup.append("g")
    .call(leftAxis)
    .style("text-anchor", "end")
    .style("font-size", "14");

  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", "14")
    .attr("transform", "rotate(-60)");

  var circlesGroup = chartGroup.selectAll(id1)
    .data(entries)
    .enter()
    .append("circle")
    .attr("cx", ([prop, vals]) => xBandScale(prop))
    .attr("cy", ([prop, vals]) => yLinearScale(vals[index_y]))
    .attr("r", ([prop, vals]) => vals[5]*0.5)
    .attr("fill", "blue")
    .attr("opacity", "0.55");

  var textGroup = chartGroup.selectAll("text.testing")
    .data(entries)
    .enter()
    .append("text")
    .attr("class", "testing")
    .attr("dx", ([prop, vals]) => xBandScale(prop))
    .attr("dy", ([prop, vals]) => yLinearScale(vals[5]))
    .text(([prop, vals]) => `${vals[4]} mph`);

    // Create group for three x-axis labels
  var labelsGroupX = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var countyLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 80)
  .attr("value", "County") // value to grab for event listener
  .classed("active", true)
  .text("County");

  var labelsGroupY = chartGroup.append("g");

  var ageLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -45)
  .attr("x",  0 - (chartHeight / 2))
  .attr("dy", "1em")
  .attr("value", "Age") // value to grab for event listener
  .classed("active", true)
  .text("Age (years)"); 

}).catch(function(error) {
  console.log(error);
});


// var svg = d3.select(id2)
//   .append("svg")
//   .attr("height", svgHeight)
//   .attr("width", svgWidth);

// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// d3.json("/read_pedestrians").then(function(Data) {
  
//   console.log(Data);
//   button.on("click", ()=>runEnter(Data, id2));

//   let entries = Object.entries(Data);

//   var chosenXAxis = "County";
//   var chosenYAxis = "Age";
//   index_y = findIndex(chosenYAxis);

//   var xBandScale = xScale(Data, chosenXAxis);
//   var yLinearScale = yScale(Data, chosenYAxis);

//   // Create two new functions passing our scales in as arguments
//   // These will be used to create the chart's axes
//   var bottomAxis = d3.axisBottom(xBandScale);
//   var leftAxis = d3.axisLeft(yLinearScale).ticks();

//   // Append two SVG group elements to the chartGroup area,
//   // and create the bottom and left axes inside of them
//   var yAxis = chartGroup.append("g")
//     .call(leftAxis)
//     .style("text-anchor", "end")
//     .style("font-size", "13");

//   var xAxis = chartGroup.append("g")
//     .attr("transform", `translate(0, ${chartHeight})`)
//     .call(bottomAxis)
//     .selectAll("text")
//     .style("text-anchor", "end")
//     .style("font-size", "13")
//     .attr("transform", "rotate(-60)");

//   var circlesGroup = chartGroup.selectAll(id2)
//     .data(entries)
//     .enter()
//     .append("circle")
//     .attr("cx", ([prop, vals]) => xBandScale(prop))
//     .attr("cy", ([prop, vals]) => yLinearScale(vals[index_y]))
//     .attr("r", ([prop, vals]) => vals[5]*0.5)
//     .attr("fill", "blue")
//     .attr("opacity", "0.55");

//   var textGroup = chartGroup.selectAll("text.testing")
//     .data(entries)
//     .enter()
//     .append("text")
//     .attr("class", "testing")
//     .attr("dx", ([prop, vals]) => xBandScale(prop))
//     .attr("dy", ([prop, vals]) => yLinearScale(vals[5]))
//     .text(([prop, vals]) => `${vals[3]}/24h`);

//     // Create group for three x-axis labels
//   var labelsGroupX = chartGroup.append("g")
//   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

//   var countyLabel = labelsGroupX.append("text")
//   .attr("x", 0)
//   .attr("y", 60)
//   .attr("value", "County") // value to grab for event listener
//   .classed("active", true)
//   .text("County");

//   var labelsGroupY = chartGroup.append("g");

//   var ageLabel = labelsGroupY.append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("y", -45)
//   .attr("x",  0 - (chartHeight / 2))
//   .attr("dy", "1em")
//   .attr("value", "Age") // value to grab for event listener
//   .classed("active", true)
//   .text("Age (years)"); 

// }).catch(function(error) {
//   console.log(error);
// });





// var svgWidth1 = 960;
// var svgHeight1 = 660;

// // Define the chart's margins as an object
// var chartMargin1 = {
//   top: 30,
//   right: 30,
//   bottom: 30,
//   left: 100
// };

// var svg1 = d3.select(id2)
//   .append("svg")
//   .attr("height", svgHeight1)
//   .attr("width", svgWidth1);

// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
// var chartGroup1 = svg1.append("g")
//   .attr("transform", `translate(${chartMargin1.left}, ${chartMargin1.top})`);

// // Load data from hours-of-tv-watched.csv
// d3.json("/read_pedestrians").then(function(Data) {

  
//   console.log(Data);
//   button.on("click", ()=>runEnter(Data, id2));

//   // button.on("click", ()=>runEnter(Data));

//   let entries = Object.entries(Data);
//     // entries.map( ([prop, vals]) => console.log(vals[0]));

//   // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
//   var xBandScale = d3.scaleBand()
//     .domain(entries.map(([prop, vals])=> prop))
//     .range([0, chartWidth])
//     .padding(0.2);

//     var max_d = d3.max(entries.map( ([prop, vals]) => vals[5]));
//     var add_to_max_d = 0.1 * (d3.max(entries.map( ([prop, vals]) => vals[5])));
//     var max_domain = 0.11*(max_d + add_to_max_d);
//     console.log(max_domain);
//   // Create a linear scale for the vertical axis.
//     var yLinearScale = d3.scaleLinear()
//     .domain([0, max_domain])
//     .range([chartHeight, 0]);

//   // Create two new functions passing our scales in as arguments
//   // These will be used to create the chart's axes
//   var bottomAxis = d3.axisBottom(xBandScale);
//   var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

//   // Append two SVG group elements to the chartGroup area,
//   // and create the bottom and left axes inside of them
//   chartGroup1.append("g")
//     .call(leftAxis);

//   chartGroup1.append("g")
//     .attr("transform", `translate(0, ${chartHeight})`)
//     .call(bottomAxis);

// // entries.map( ([prop, vals]) => console.log(vals[0]));

// console.log(max_domain);

//   chartGroup1.selectAll("#pedes")
//     .data(entries)
//     .enter()
//     .append("circle")
//     .attr("cx", ([prop, vals]) => xBandScale(prop))
//     .attr("cy", ([prop, vals]) => yLinearScale(vals[5]))
//     .attr("r", ([prop, vals]) => vals[5]*0.5)
//     .attr("fill", "blue")
//     .attr("opacity", "0.6");

// }).catch(function(error) {
//   console.log(error);
// });






