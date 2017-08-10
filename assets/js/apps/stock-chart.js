// Credits: http://bl.ocks.org/abeppu/1074045
var stockelement = "#stock-chart";
var width = $(stockelement).parent().width();
var height = 400;
var xticks = 15;
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


var dateFormat = d3.time.format("%Y-%m-%d");
var end = new Date();
var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);
var data = [];

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function buildChart(data) {
    $(stockelement).html("");
    var margin = 60;
    var width = $(stockelement).parent().width();
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var chart = d3.select("#stock-chart")
        .append("svg:svg")
        .attr("class", "chart")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 "+width+" "+height)
        .attr("width", width)
        .attr("height", height);
    var y = d3.scale.linear()
        .domain([d3.min(data.map(function(x) {
            return x["Low"];
        })), d3.max(data.map(function(x) {
            return x["High"];
        }))])
        .range([height - margin, margin]);
    var x = d3.scale.linear()
        .domain([d3.min(data.map(function(d) {
                return dateFormat.parse(d.Date).getTime();
            })),
            d3.max(data.map(function(d) {
                return dateFormat.parse(d.Date).getTime();
            }))
        ])
        .range([margin, width - margin]);

    chart.selectAll("line.y")
        .data(y.ticks(10))
        .enter().append("svg:line")
        .attr("class", "y")
        .attr("x1", 15)
        .attr("x2", width - margin)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "#ddd");

    chart.selectAll("text.xrule")
        .data(x.ticks(xticks))
        .enter().append("svg:text")
        .attr("class", "xrule")
        .attr("x", x)
        .attr("y", height - margin)
        .attr("dy", 35)
        .attr("fill", "#888")
        .attr("font-family", "Helvetica")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .text(function(d) {
            var date = new Date(d);
            return monthNames[(date.getMonth())] + " " + date.getDate();
        });

    chart.selectAll("text.yrule")
        .data(y.ticks(10))
        .enter().append("svg:text")
        .attr("class", "yrule")
        .attr("x", width - margin)
        .attr("y", y)
        .attr("dy", 0)
        .attr("dx", 35)
        .attr("fill", "#444")
        .attr("font-family", "Helvetica")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .text(String);

    chart.selectAll("rect")
        .data(data)
        .enter().append("svg:rect")
        .attr("x", function(d) {
            return x(dateFormat.parse(d.Date).getTime());
        })
        .attr("y", function(d) {
            return y(max(d.Open, d.Close));
        })
        .attr("height", function(d) {
            return y(min(d.Open, d.Close)) - y(max(d.Open, d.Close));
        })
        .attr("width", function(d) {
            return 0.5 * (width - 2 * margin) / data.length;
        })
        .attr("fill", function(d) {
            return d.Open > d.Close ? "#eb5055" : "#68c39f";
        });

    chart.selectAll("line.stem")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "stem")
        .attr("x1", function(d) {
            return x(dateFormat.parse(d.Date).getTime()) + 0.25 * (width - 2 * margin) / data.length;
        })
        .attr("x2", function(d) {
            return x(dateFormat.parse(d.Date).getTime()) + 0.25 * (width - 2 * margin) / data.length;
        })
        .attr("y1", function(d) {
            return y(d.High);
        })
        .attr("y2", function(d) {
            return y(d.Low);
        })
        .attr("stroke", function(d) {
            return d.Open > d.Close ? "#eb5055" : "#68c39f";
        })

}


function appendToData(x) {

    data = x.query.results.quote;
    for (var i = 0; i < data.length; i++) {
        data[i].timestamp = (new Date(data[i].date).getTime() / 1000);
    }
    data = data.sort(function(x, y) {
        return x.timestamp - y.timestamp;
    });
    //alert(data);
    buildChart(data);
}

function buildQuery() {
    var symbol = $(".stock-options a.active").data("stock");
    if (symbol == "GOOG") {
        $("#stock-title strong").text("Google Inc");
    }else if (symbol == "AMZN") {
        $("#stock-title strong").text("Amazon");
    }else if (symbol == "^IXIC") {
        $("#stock-title strong").text("NASDAQ");
    }else if (symbol == "^GSPC") {
        $("#stock-title strong").text("S&P");
    }

    var base = "select * from yahoo.finance.historicaldata where symbol = \"{0}\" and startDate = \"{1}\" and endDate = \"{2}\"";
    var getDateString = d3.time.format("%Y-%m-%d");
    var query = base.format(symbol, getDateString(start), getDateString(end));
    query = encodeURIComponent(query);
    var url = "http://query.yahooapis.com/v1/public/yql?q={0}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys".format(query);
    return url;
}

function fetchData() {
    var width = $(stockelement).parent().width();
    if(width < 400){
        xticks = 4;
        start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 15);
    }else if(width < 600){
        xticks = 5;
        start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 30);
    }else{
        xticks = 15;
        start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);
    }
    url = buildQuery();
    $.get(url,function(data){
      appendToData(data);
    });

}

$(document).ready(function(){
  $(".stock-options a").click(function(){
      $(".stock-options a").removeClass("active");
      $(this).addClass("active");
      fetchData();
      return false;
  })
  resizefunc.push("fetchData");
});
