$(function(){
	    // Bar + line composite charts
    $('#compositebar').sparkline('html', { type: 'bar', barColor: '#aaf' });
    $('#compositebar').sparkline([4,1,5,7,9,9,8,7,6,6,4,7,8,4,3,2,2,5,6,7], 
        { composite: true, fillColor: false, lineColor: 'red' });

    // Larger line charts for the docs
    $('.largeline').sparkline('html', 
        { type: 'line', height: '2.5em', width: '4em' });

    // Customized line chart
    $('#linecustom').sparkline('html', 
        {height: '1.5em', width: '8em', lineColor: '#f00', fillColor: '#ffa', 
        minSpotColor: false, maxSpotColor: false, spotColor: '#77f', spotRadius: 3});

    // Bar charts using inline values
    $('.sparkbar').sparkline('html', {type: 'bar'});

    $('.barformat').sparkline([1, 3, 5, 3, 8], {
        type: 'bar',
        tooltipFormat: '{{value:levels}} - {{value}}',
        tooltipValueLookups: {
            levels: $.range_map({ ':2': 'Low', '3:6': 'Medium', '7:': 'High' })
        }
    });

    // Tri-state charts using inline values
    $('.sparktristate').sparkline('html', {type: 'tristate'});
    $('.sparktristatecols').sparkline('html', 
        {type: 'tristate', colorMap: {'-2': '#fa7', '2': '#44f'} });

    // Composite line charts, the second using values supplied via javascript
    $('#compositeline').sparkline('html', { fillColor: false, changeRangeMin: 0, chartRangeMax: 10 });
    $('#compositeline').sparkline([4,1,5,7,9,9,8,7,6,6,4,7,8,4,3,2,2,5,6,7], 
        { composite: true, fillColor: false, lineColor: 'red', changeRangeMin: 0, chartRangeMax: 10 });

    // Line charts with normal range marker
    $('#normalline').sparkline('html', 
        { fillColor: false, normalRangeMin: -1, normalRangeMax: 8 });
    $('#normalExample').sparkline('html', 
        { fillColor: false, normalRangeMin: 80, normalRangeMax: 95, normalRangeColor: '#4f4' });

    // Discrete charts
    $('.discrete1').sparkline('html', 
        { type: 'discrete', lineColor: 'blue', xwidth: 18 });
    $('#discrete2').sparkline('html', 
        { type: 'discrete', lineColor: 'blue', thresholdColor: 'red', thresholdValue: 4 });

    // Bullet charts
    $('.sparkbullet').sparkline('html', { type: 'bullet' });

    // Pie charts
    $('.sparkpie').sparkline('html', { type: 'pie', height: '1.0em' });

    // Box plots
    $('.sparkboxplot').sparkline('html', { type: 'box'});
    $('.sparkboxplotraw').sparkline([ 1, 3, 5, 8, 10, 15, 18 ], 
        {type:'box', raw: true, showOutliers:true, target: 6});

    // Box plot with specific field order
    $('.boxfieldorder').sparkline('html', {
        type: 'box', 
        tooltipFormatFieldlist: ['med', 'lq', 'uq'], 
        tooltipFormatFieldlistKey: 'field'
    });

    // click event demo sparkline
    $('.clickdemo').sparkline();
    $('.clickdemo').bind('sparklineClick', function(ev) {
        var sparkline = ev.sparklines[0],
            region = sparkline.getCurrentRegionFields();
            value = region.y;
        alert("Clicked on x="+region.x+" y="+region.y);
    });

});