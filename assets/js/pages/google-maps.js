$(function(){

	$("#gmap-1").gmap3({
	  marker:{
	    latLng: [46.578498,2.457275],
	    options:{
	      draggable:true
	    },
	    events:{
	      dragend: function(marker){
	        $(this).gmap3({
	          getaddress:{
	            latLng:marker.getPosition(),
	            callback:function(results){
	              var map = $(this).gmap3("get"),
	                infowindow = $(this).gmap3({get:"infowindow"}),
	                content = results && results[1] ? results && results[1].formatted_address : "no address";
	              if (infowindow){
	                infowindow.open(map, marker);
	                infowindow.setContent(content);
	              } else {
	                $(this).gmap3({
	                  infowindow:{
	                    anchor:marker, 
	                    options:{content: content}
	                  }
	                });
	              }
	            }
	          }
	        });
	      }
	    }
	  },
	  map:{
	    options:{
	      zoom: 5
	    }
	  }
	});

	$("#gmap-2").gmap3({
	  map:{
	    options:{
	      center:[46.578498,2.457275],
	      zoom: 4,
	      mapTypeId: google.maps.MapTypeId.TERRAIN
	    }
	  },
	  marker:{
	    values: [
	      [49.28952958093682, 6.152559438984804],
	      {
	        latLng:[44.28952958093682, 6.152559438984804],
	        options:{
	          icon: "http://maps.google.com/mapfiles/marker_green.png"
	        }
	      },
	      [49.28952958093682, -1.1501188139848408],
	      {
	        latLng:[44.28952958093682, -1.1501188139848408],
	        events:{
	          click:function(){
	            alert("I'm the last one, and i have my own click event");
	          }
	        }
	      }
	    ],
	    events:{ // events trigged by markers 
	      click: function(){
	        alert("Here is the default click event");
	      }
	    },
	    cluster:{
	      radius: 100,
	      0: {
	        content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
	        width: 53,
	        height: 52
	      },
	      20: {
	        content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
	        width: 56,
	        height: 55
	      },
	      50: {
	        content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>",
	        width: 66,
	        height: 65
	      }
	    }
	  }
	});

	var fenway = new google.maps.LatLng(42.345573,-71.098326);
	$("#gmap-3").gmap3({
	  map:{
	    options:{
	      zoom: 14,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      streetViewControl: true,
	      center: fenway
	    }
	  },   
	  streetviewpanorama:{
	    options:{
	      container: $("#gmap-4"),
	      opts:{
	        position: fenway,
	        pov: {
	          heading: 34,
	          pitch: 10,
	          zoom: 1
	        }
	      }
	    }
	  }
	});

	$("#gmap-5").gmap3({
    map:{
      address:"ISTABBUL, TURKEY",
      options:{
        zoom:4,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        scrollwheel: true,
        streetViewControl: true
      }
    }
  });

	$("#gmap-6").gmap3({
	  map:{
	    options:{
	      center:[33, -111],
	      zoom:10,
	      mapTypeControlOptions: { 
	        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 
	                    google.maps.MapTypeId.SATELLITE,
	                    google.maps.MapTypeId.HYBRID,
	                    google.maps.MapTypeId.TERRAIN,
	                    "sectional"]
	      }
	    }
	  },
	  imagemaptype:{
	    id: "sectional",
	    options:{
	      getTileUrl: function(coord, zoom) { 
	         return "http://www.fourpeaksnavigation.com/sectionals/phx" + "/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
	      }, 
	      tileSize: new google.maps.Size(256, 256), 
	      isPng: true,
	      name: "Chart",
	      minZoom: 1,
	      maxZoom: 111
	    },
	    callback: function(){
	      $(this).gmap3("get").setMapTypeId("sectional");
	    }
	  }
	}); 
});