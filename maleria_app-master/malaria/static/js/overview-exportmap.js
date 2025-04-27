const init = function() {
  document
    .getElementById("year_slider")
    .addEventListener("click", exportslider);
};

var width = 760,
  height = 200;
border = 1;
bordercolor = "black";
var projection = d3.geo
  .mercator()
  .center([0, 5])
  .scale([width / (2 * Math.PI)]); // scale to fit group width
//.translate([width/2,height/2])
//.rotate([-180,0]);

var exportsvg = d3
  .select("#exportmap")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 400")
  .classed("svg-content-responsive", true)
  .attr("border", border);

var path = d3.geo.path().projection(projection);

var borderPath = exportsvg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 400")
  .classed("svg-content-responsive", true)
  .style("stroke", bordercolor)
  .style("fill", "none")
  .style("stroke-width", border);
var exportg = exportsvg.append("g");

var exporttooltip = d3
  .select("#exportmap")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1)
  .style("position", "absolute")
  .style("padding", "0 10px");

// load and display the World

function redraw(year) {
  d3.json("json-data/worldmap.json", function(error, topology) {
    // load and display the cities
    d3.json("http://localhost:9007/ong/exportmapchart")
      .header("Custom-Authorization", "Bearer noauth")
      .get(function(error, data) {
        var sorted = data.sort(function(a, b) {
          if (a.value < b.value) return 1;
          if (a.value > b.value) return -1;
          return 0;
        });

        exportg
          .selectAll("rect")
          .data(
            sorted.filter(function(d) {
              return d.year == year;
            })
          )
          .enter()
          .append("a")
          .append("rect")
          .attr("x", function(d) {
            // console.log(projection([d.lon, d.lat])[0]);
            return projection([d.lon, d.lat])[0];
          })
          .attr("y", function(d) {
            return projection([d.lon, d.lat])[1];
          })
          .attr("width", function(d, i) {
            var textlabel =
              i + 1 + " . " + d.country + "(" + d.value + " BB" + ")";
            console.log(textlabel.length);
            return textlabel.length * 7.5;
          })
          .attr("height", "22")
          .attr("rx", 10)
          .style("fill", function(d) {
            return d3.rgb("#f5d1bc").darker();
          });
        // .attr("title", function(d) {
        //   return d.country + "(" + d.value + " BB" + ")";
        // });

        var expolabel = exportg.selectAll("text").data(
          sorted.filter(function(d) {
            return d.year == year;
          })
        );
        expolabel.enter().append("svg:text");
        expolabel.exit().remove();
        expolabel
          .attr("class", "label")
          .transition()
          .duration(1000)
          .attr("x", function(d) {
            //console.log(d);
            return projection([d.lon, d.lat])[0] + 5;
          })
          .attr("y", function(d) {
            return projection([d.lon, d.lat])[1] + 15;
          })
          .attr("dy", "0.1em")

          .text(function(d, i) {
            // console.log(d);
            var c = i + 1 + " . " + d.country;
            var r = "(" + d.value + " BB" + ")";
            return c + r;
          });
      });
    exportg
      .selectAll("path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
      .append("path")
      .attr("d", path);
  });
}

function drawmap() {
  redraw(2018);
}

const exportslider = function() {
  let data = document.getElementById("year_slider_val").innerText;
  redraw(data);
  console.log(data);
};

document.addEventListener("DOMContentLoaded", init);
