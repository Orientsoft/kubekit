var initCharts = function() {
  var charts = $('.percentage');
  charts.easyPieChart({
    animate: 1000,
    lineWidth: 5,
    barColor: "#eb5055",
    lineCap: "butt",
    size: "150",
    scaleColor: "transparent",
    onStep: function(from, to, percent) {
		$(this.el).find('.cpercent').text(Math.round(percent));
	}
  });
  $('.updatePieCharts').on('click', function(e) {
    e.preventDefault();
    charts.each(function() {
      $(this).data('easyPieChart').update(Math.floor(100*Math.random()));
    });
  });
}

$(function(){
  $(".knob").knob();
  initCharts();
})