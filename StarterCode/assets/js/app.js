
// D3 Animated Scatter Plot
// I couldn't figure out why the state abbr. wouldn't work

//Pre-Data Setup
// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 4;

// Margin spacing for graph
var margin = 20;

// Space for placing words
var labelArea = 110;

// Padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// The Labels for our Axes

// A) Bottom Axis
// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");



  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );


// Now we use xText to append 3 text SVG files
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// B) Left Axis

// Specifying the variables like this allows us to make our transform attributes more readable
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");



  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );

//Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// Import our .csv file
// Import our CSV data with d3's .csv import method
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});

//Create the visualization function
function visualize(theData) {
  var curX = "poverty";
  var curY = "healthcare";

  // save empty variables for our the min and max values of x and y
  var xMin;
  var xMax;
  var yMin;
  var yMax;



  // PART 2:
  // reducing some repitition from later code

  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum 
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max will grab the largest datum 
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum 
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // .max will grab the largest datum 
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // Part 3: Incorporate the Scatter Plot
  // grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  // With the min and max values now defined we can create our scales
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // We next append the axes in group elements
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // make a grouping for our dots and their labels
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each row of data
  theCircles
    .append("circle")
    // These attr's specify location, size, and class
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })}
