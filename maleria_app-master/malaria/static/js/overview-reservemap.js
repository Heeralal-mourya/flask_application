const init = function() {
  document
    .getElementById("year_slider")
    .addEventListener("click", reserveslider);
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

var reservesvg = d3
  .select("#reservemap")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 400")
  .classed("svg-content-responsive", true)
  .attr("border", border);

var path = d3.geo.path().projection(projection);

var borderPath = reservesvg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 400")
  .classed("svg-content-responsive", true)
  .style("stroke", bordercolor)
  .style("fill", "none")
  .style("stroke-width", border);
var reserveg = reservesvg.append("g");

var reservetooltip = d3
  .select("#reservemap")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1)
  .style("position", "absolute")
  .style("padding", "0 10px");

//var labels = reservesvg.append("svg:g").attr("id", "labels");

// load and display the World
function redraw(year) {
  d3.json("json-data/worldmap.json", function(error, topology) {
    // d3.json(
    //   "http://127.0.0.1:8080/Downloads/ong_data/jsonfile/reservemap.json",
    //   function(error, data) {
    // load and display the cities
    d3.json("http://localhost:9007/ong/reservemapchart")
      .header("Custom-Authorization", "Bearer noauth")
      .get(function(error, data) {
        var sorted = data.sort(function(a, b) {
          if (a.value < b.value) return 1;
          if (a.value > b.value) return -1;
          return 0;
        });

        reserveg
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

        var reslabel = reserveg.selectAll("text").data(
          sorted.filter(function(d) {
            return d.year == year;
          })
        );

        reslabel.exit().remove();
        reslabel.enter().append("svg:text");
        reslabel
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
    reserveg
      .selectAll("path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
      .append("path")
      .attr("d", path);
  });
}

function arrangeLabels() {
  var move = 1;
  while (move > 0) {
    move = 0;
    reserveg.selectAll(".label").each(function() {
      var that = this,
        a = this.getBoundingClientRect();
      console.log("a " + JSON.stringify(a));
      reserveg.selectAll(".label").each(function() {
        if (this != that) {
          var b = this.getBoundingClientRect();
          console.log("b " + JSON.stringify(b));
          if (
            Math.abs(a.left - b.left) * 2 < a.width + b.width &&
            Math.abs(a.top - b.top) * 2 < a.height + b.height
          ) {
            // overlap, move labels
            var dx =
                (Math.max(0, a.right - b.left) +
                  Math.min(0, a.left - b.right)) *
                0.01,
              dy =
                (Math.max(0, a.bottom - b.top) +
                  Math.min(0, a.top - b.bottom)) *
                0.02,
              tt = d3.transform(d3.select(this).attr("transform")),
              to = d3.transform(d3.select(that).attr("transform"));
            move += Math.abs(dx) + Math.abs(dy);

            to.translate = [to.translate[0] + dx, to.translate[1] + dy];
            tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
            d3.select(this).attr(
              "transform",
              "translate(" + tt.translate + ")"
            );
            d3.select(that).attr(
              "transform",
              "translate(" + to.translate + ")"
            );
            a = this.getBoundingClientRect();
          }
        }
      });
    });
  }
}

function drawmap() {
  redraw(2018);
}

const reserveslider = function() {
  let data = document.getElementById("year_slider_val").innerText;
  redraw(data);
  console.log(data);
};

document.addEventListener("DOMContentLoaded", init);
