var timer;
var graph;
var graph2;

$(document).ready(function(){
    $(".dial").knob();
      var cityAreaData = [
        500.70,
        410.16,
        210.69,
        120.17,
        64.31,
        150.35,
        130.22,
        120.71,
        300.32
    ]
    $('#vector-map').vectorMap({
        map: 'us_aea_en',
        normalizeFunction: 'polynomial',
        zoomOnScroll:true,
        focusOn:{
            x: 0,
            y: 0,
            scale: 0.9
        },
        zoomMin:0.9,
        hoverColor: false,
        regionStyle:{
            initial: {
                fill: '#bbbbbb',
                "fill-opacity": 1,
                stroke: '#a5ded9',
                "stroke-width": 0,
                "stroke-opacity": 0
            },
            hover: {
                "fill-opacity": 0.8
            }
        },
        markerStyle: {
            initial: {
                fill: '#F57A82',
                stroke: 'rgba(230,140,110,.8)',
                "fill-opacity": 1,
                "stroke-width": 9,
                "stroke-opacity": 0.5,
                r: 3
            },
            hover: {
                stroke: 'black',
                "stroke-width": 2
            },
            selected: {
                fill: 'blue'
            },
            selectedHover: {
            }
        },
        backgroundColor: '#ffffff',
        markers :[

            {latLng: [35.85, -77.88], name: 'Rocky Mt,NC'},
            {latLng: [32.90, -97.03], name: 'Dallas/FW,TX'},
            {latLng: [39.37, -75.07], name: 'Millville,NJ'}

        ],
        series: {
            markers: [{
                attribute: 'r',
                scale: [3, 7],
                values: cityAreaData
            }]
        }
    });
  if ("geolocation" in navigator) {
    $('.js-geolocation').show(); 
  } else {
    $('.js-geolocation').hide();
  }

  /* Where in the world are you? */
  $(document).on('click', '.js-geolocation', function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
  });

  resizefunc.push("reload_charts");
  //$(".content-page").resize(debounce(reload_charts,100));

  load_charts();
  loadWeather('Seattle','');
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  var cTime = new Date(), month = cTime.getMonth()+1, year = cTime.getFullYear();

  var events = [
      {
        "date": "4/"+month+"/"+year, 
        "title": 'Meet a friend', 
        "link": 'javascript:;', 
        "color": 'rgba(255,255,255,0.2)', 
        "content": 'Contents here'
      },
      {
        "date": "7/"+month+"/"+year, 
        "title": 'Kick off meeting!', 
        "link": 'javascript:;', 
        "color": 'rgba(255,255,255,0.2)', 
        "content": 'Have a kick off meeting with .inc company'
      },
      {
        "date": "19/"+month+"/"+year, 
        "title": 'Link to Google', 
        "link": 'http://www.google.com', 
        "color": 'rgba(255,255,255,0.2)', 
      }
    ];

    $('#calendar-box2').bic_calendar({
        events: events,
        dayNames: dayNames,
        monthNames: monthNames,
        showDays: true,
        displayMonthController: true,
        displayYearController: false,
        popoverOptions:{
            placement: 'top',
            trigger: 'hover',
            html: true
        },
        tooltipOptions:{
            placement: 'top',
            html: true
        }
    });
});

function loadWeather(location, woeid) {
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="wicon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+' <span class="w-temp2">/ '+weather.tempAlt+'&deg;F</span></h2>';
      html += '<span class="w-region">'+weather.city+', '+weather.region+'</li>';
      html += '<span class="w-currently">'+weather.currently+'</span>';
      html += '';  
      
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}

function reload_charts(){
  graph.configure({
    width: $("#home-chart-3").width()
  });
  graph.render();

  graph2.configure({
    width: $("#home-chart-2").width()
  });
  graph2.render();
  window.morris1.redraw();
  window.morris2.redraw();
}

function load_charts(){
    //MORRIS

    window.morris1 = Morris.Bar({
      element: 'morris-bar-home',
      data: [
        { y: 'Indonesia', a: 952},
        { y: 'India', a: 985},
        { y: 'Malaysia', a: 955},
        { y: 'China', a: 785 },
        { y: 'Philipina', a: 700 },
        { y: 'Autralia', a: 601 },
        { y: 'United Kingdom', a: 421 },
        { y: 'United States', a: 725 },
        { y: 'Taiwan', a: 350 },
        { y: 'New Zealand', a: 120 },
        { y: 'Singapore', a: 124}
      ],
      xkey: 'y',
      ykeys: ['a'],
      redraw: true,
      labels: ['Visitor'],
      resize: true,
      barColors: ['#45B29D'],
      gridTextColor: ['#777'],
      gridTextSize: 11,
      hideHover: 'auto',
      grid :false
    });

    //MORRIS
    window.morris2 = Morris.Area({
        element: 'morris-home',
        padding: 10,
        behaveLikeLine: true,
        gridEnabled: false,
        gridLineColor: '#dddddd',
        axes: true,
        resize: true,
        smooth:true,
        pointSize: 0,
        lineWidth: 0,
        fillOpacity:0.85,
        data: [
          {period: '2010 Q1', iphone: 4666, ipad: 3666, itouch: 2666},
          {period: '2010 Q2', iphone: 4441, ipad: 3441, itouch: 2441},
          {period: '2010 Q3', iphone: 6501, ipad: 4501, itouch: 2501},
          {period: '2010 Q4', iphone: 7689, ipad: 6689, itouch: 5689},
          {period: '2011 Q1', iphone: 4293, ipad: 3293, itouch: 2293},
          {period: '2011 Q2', iphone: 5881, ipad: 3881, itouch: 1881},
          {period: '2011 Q3', iphone: 5588, ipad: 3588, itouch: 1588},
          {period: '2011 Q4', iphone: 15073, ipad: 8967, itouch: 5175},
          {period: '2012 Q1', iphone: 10687, ipad: 4460, itouch: 2028},
          {period: '2012 Q2', iphone: 12432, ipad: 5713, itouch: 3791}
        ],
        lineColors:['#869d9d','#EFC94C','#45B29D'],
        xkey: 'period',
        redraw: true,
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['All Visitors', 'Returning Visitors', 'Unique Visitors'],
        hideHover: 'auto'

    });
    /*
    Morris.Donut({
      element: 'morris-donut',
      data: [
        {label: "Download Sales", value: 12},
        {label: "In-Store Sales", value: 30},
        {label: "Mail-Order Sales", value: 20}
      ]
    });
    */
    var seriesData = [ [], [], []];
    var random = new Rickshaw.Fixtures.RandomData(50);

    for (var i = 0; i < 40; i++) {
      random.addData(seriesData);
    }

    graph = new Rickshaw.Graph( {
      element: document.querySelector("#home-chart-3"),
      height: 150,
      renderer: 'line',
      interpolation: 'linear',
      series: [
        {
          data: seriesData[0],
          color: 'rgba(0,0,0,0.4)',
          name:'S&P'
        },{
          data: seriesData[1],
          color: 'rgba(0,0,0,0.3)',
          name:'Dow jones'
        },{
          data: seriesData[2],
          color: 'rgba(0,0,0,0.2)',
          name:'Nasdaq'
        }
      ]
    } );
    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    graph.render();

    setInterval( function() {
		random.removeData(seriesData);
		random.addData(seriesData);
		for (lastitem in seriesData[0]);
		var cur = parseInt($("#sp-status").text());

		if(cur > seriesData[0][lastitem].y.toFixed(2)){
			$("#sp-status").addClass("text-danger").html("<i class='fa fa-caret-down'></i> "+seriesData[0][lastitem].y.toFixed(2));
		}else{
			$("#sp-status").removeClass("text-danger").html("<i class='fa fa-caret-up'></i> "+seriesData[0][lastitem].y.toFixed(2));
		}
		for (lastitem in seriesData[1]);
		var cur = parseInt($("#dow-status").text());

		if(cur > seriesData[1][lastitem].y.toFixed(2)){
			$("#dow-status").addClass("text-danger").html("<i class='fa fa-caret-down'></i> "+seriesData[1][lastitem].y.toFixed(2));
		}else{
			$("#dow-status").removeClass("text-danger").html("<i class='fa fa-caret-up'></i> "+seriesData[1][lastitem].y.toFixed(2));
		}
		for (lastitem in seriesData[2]);
		var cur = parseInt($("#nasdaq-status").text());

		if(cur > seriesData[2][lastitem].y.toFixed(2)){
			$("#nasdaq-status").addClass("text-danger").html("<i class='fa fa-caret-down'></i> "+seriesData[2][lastitem].y.toFixed(2));
		}else{
			$("#nasdaq-status").removeClass("text-danger").html("<i class='fa fa-caret-up'></i> "+seriesData[2][lastitem].y.toFixed(2));
		}
		graph.update();

    },5000);

    var seriesData2 = [ [], []];
    var random2 = new Rickshaw.Fixtures.RandomData(50);

    for (var i = 0; i < 50; i++) {
      random2.addData(seriesData2);
    }
    graph2 = new Rickshaw.Graph( {
      element: document.querySelector("#home-chart-2"),
      height: 150,
      interpolation: 'linear',
      renderer: 'area',
      series: [
        {
          data: seriesData2[0],
          color: 'rgba(255,255,255,0.3)',
          name:'Web Server'
        },{
          data: seriesData2[1],
          color: 'rgba(255,255,255,0.1)',
          name:'Database Server'
        }
      ]
    } );
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph2
    });

    graph2.render();
    clearInterval(timer);
    timer = setInterval( function() {
      random2.removeData(seriesData2);
      random2.addData(seriesData2);
      for (lastitem in seriesData2[0]);
      $('.ws-load').data('easyPieChart').update(seriesData2[0][lastitem].y);
      //for (lastitem in seriesData2[1]);
      //$('.ds-load').data('easyPieChart').update(seriesData2[1][lastitem].y);
      graph2.update();

    },2000);

    $('.ws-load').easyPieChart({
        animate: 1000,
        trackColor: "rgba(0,0,0,0.1)",
        barColor: "#68C39F",
        scaleColor: false,
        size: 90,
        onStep: function(from, to, percent) {
          $(this.el).find('.percent').text(Math.round(percent));
        }
    });
    /*$('.ds-load').easyPieChart({
        animate: 1000,
        scaleColor: false,
        trackColor: "rgba(0,0,0,0.1)",
        barColor: "#68C39F",
        size: 50,
        onStep: function(from, to, percent) {
          $(this.el).find('.percent').text(Math.round(percent));
        }
    });*/
}
//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3dDOW%2CNASDAQ%2CSP%26f%3Dsl1d1t1c1ohgv%26e%3D.csv%27%20and%20columns%3D%27symbol%2Cprice%2Cdate%2Ctime%2Cchange%2Ccol1%2Chigh%2Clow%2Ccol2%27&format=json&diagnostics=true&callback=