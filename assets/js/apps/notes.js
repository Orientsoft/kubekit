var autosave;
var autosave_time = 5000; // miliseconds

$(document).ready(function(){
	load_list();

	$("#notes-list .scroller").slimscroll({
      height: '330px',
      size: "5px"
    });

	$(".add-note").click(function(){
		save_note();
		$("#notes-app").addClass("new-item");
		$("#note-text").val("");
		$("#note-text").attr("rel",guidGenerator());
	});

	$(".back-note-list").click(function(){
		save_note();
		$("#notes-app").removeClass("new-item");
	});

	$(document).on("click", "#notes-list .note-trunc", function(e){
		e.preventDefault();
		var id = $(this).attr("rel");
		$("#note-text").attr("rel",id);
		$("#note-text").val(localStorage.getItem(id));
		$("#notes-app").addClass("new-item");
	});

	$(document).on("blur change", "#note-text", function(){
		save_note();
	});

	$(document).on("click", "#notes-list .kill-note", function(e){
		e.preventDefault();
		var id = $(this).attr("rel");
		bootbox.confirm("Are you sure to remove this note?", function(result) {
		    if(result === true){
		    	localStorage.removeItem(id);
		    	load_list();
		    }
		}); 
	});

	autosave = window.setInterval(function(){
		if($("#notes-app").hasClass("new-item")){
			save_note();
		}
	},autosave_time);
});

function save_note(){
	if($("#note-text").val() != ""){
		$("#notes-app").addClass("saved");
		localStorage.setItem($("#note-text").attr("rel"),$("#note-text").val());
		console.log("Note saved!");
		load_list();
		window.setTimeout(function(){
			$("#notes-app").removeClass("saved");
		},1000);
		return true;
	}
	return false;
}

function load_list(){
	$("#notes-list ul").html("");
	var ids = [];
	for (var i = 0; i < localStorage.length; i++) {
		var id = localStorage.length-i-1;
		if(localStorage.key(id).startsWith("coco-note-")){
			ids.push(id);
	    }
    }
    ids = ids.sort();
    for (var x = 0;x < ids.length;x++){
        var note = localStorage.getItem(localStorage.key(ids[x])).truncate(40);
        $("#notes-list ul").append("<li><a href='javascript:;' class='note-trunc' rel='"+localStorage.key(ids[x])+"'>"+note+"</a><div class='btn-group pull-right'><a class='btn btn-sm btn-link kill-note' rel='"+localStorage.key(ids[x])+"'><i class='icon-trash'></i></a></div></li>");
    }
}

function guidGenerator() {
	var d = new Date().getTime();
	d = 9999999999999-d;
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return "coco-note-"+(d+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

String.prototype.truncate = function(m) {
  return (this.length > m) 
    ? jQuery.trim(this).substring(0, m) + "..."
    : this;
};