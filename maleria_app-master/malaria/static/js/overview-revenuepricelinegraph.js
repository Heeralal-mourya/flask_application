var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 300 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%m/%d/%Y");
var xFormat = "%d-%b";
// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3
  .line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.value);
  });

var svg1 = d3
  .select("#pricelinegraph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 380 200")
  .classed("svg-container4", true)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("http://localhost:9007/ong/presentpricelinechart")
  .header("Custom-Authorization", "Bearer noauth")
  .get(function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.value = +d.value;
    });

    x.domain(
      d3.extent(data, function(d) {
        return d.date;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.value;
      })
    ]);

    svg1
      .append("linearGradient")
      .attr("id", "line-gradient4")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(15))
      .selectAll("stop")
      .data([
        { offset: "0%", color: "red" },
        { offset: "20%", color: "red" },
        { offset: "20%", color: "blue" },
        { offset: "100%", color: "blue" }
      ])
      .enter()
      .append("stop")
      .attr("offset", function(d) {
        return d.offset;
      })
      .attr("stop-color", function(d) {
        return d.color;
      });

    svg1
      .append("path")
      .attr("class", "linevalue")
      .attr("d", valueline(data));

    svg1
      .append("text")
      .attr("x", width / 2)
      .attr("y", 3 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Leverage Ratio");

    // Add the X Axis
    svg1
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat(xFormat))
      );

    // Add the Y Axis
    svg1.append("g").call(d3.axisLeft(y).ticks(5));

    // Add the text label for the x axis
    svg1
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.bottom) + ")"
      )
      .style("text-anchor", "middle");

    // Add the text label for the Y axis
    svg1
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text("Leverage Ratio");

    var threshold = 3;

    if (threshold !== null) {
      svg1
        .append("svg:line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(threshold))
        .attr("y2", y(threshold))
        .style("stroke", "green");
    }
  });
