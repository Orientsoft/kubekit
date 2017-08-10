$(function(){
	// Initiate graphs right after interface loaded
	rungraphs();

});

function rungraphs(){
	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#chart-2"),
		width: $("#chart-2").parent().width(),
		height: 235,
		renderer: 'area',
		stroke: true,
		series: [ {
			data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 20 }, { x: 4, y: 16 } ],
			color: 'rgba(70,130,180,0.5)',
			stroke: 'rgba(0,0,0,0.15)'
		}, {
			data: [ { x: 0, y: 22 }, { x: 1, y: 25 }, { x: 2, y: 38 }, { x: 3, y: 44 }, { x: 4, y: 46 } ],
			color: 'rgba(202,226,247,0.5)',
			stroke: 'rgba(0,0,0,0.15)'
		} ]
	} );

	graph.renderer.unstack = true;
	graph.render();

	var graph = new Rickshaw.Graph({
		element: document.querySelector("#chart-1"),
		width: $("#chart-1").parent().width(),
		height: 235,
		renderer: 'line',
		series: [{
			data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
			color: '#4682b4'
		}, {
			data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
			color: '#9cc1e0'
		}]
	});
	graph.render();

	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#chart-3"),
		height: 235,
		renderer: 'bar',
		stack: false,
		series: [ 
			{
				data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
				color: '#4682b4'
			}, {
				data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
				color: '#9cc1e0'

		} ]
	} );

	graph.render();

	var graph = new Rickshaw.Graph( {
	        element: document.querySelector("#chart-4"),
	        renderer: 'bar',
	        height: 235,
	        stack: true,
	        	series: [ 
		{
			data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
			color: '#4682b4'
		}, {
			data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
			color: '#9cc1e0'

	} ]
} );

graph.render();
// set up our data series with 50 random data points

var seriesData = [ [], [], [] ];
var random = new Rickshaw.Fixtures.RandomData(150);

for (var i = 0; i < 150; i++) {
	random.addData(seriesData);
}

// instantiate our graph!

var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart-5"),
	height: 500,
	renderer: 'line',
	series: [
		{
			color: "#6FB07F",
			data: seriesData[0],
			name: 'New York'
		}, {
			color: "#FCB03C",
			data: seriesData[1],
			name: 'London'
		}, {
			color: "#FC5B3F",
			data: seriesData[2],
			name: 'Tokyo'
		}
	]
} );

graph.render();

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	graph: graph
} );

var legend = new Rickshaw.Graph.Legend( {
	graph: graph,
	element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
	graph: graph,
	legend: legend
} );

var axes = new Rickshaw.Graph.Axis.Time( {
	graph: graph
} );
axes.render();	
}