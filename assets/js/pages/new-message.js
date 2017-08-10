$(function(){
	$('.summernote-small').summernote({
	  toolbar: [
		['style', ['bold', 'italic', 'underline', 'clear']],
		['fontsize', ['fontsize']],
		['color', ['color']],
		['para', ['ul', 'ol', 'paragraph']]
	  ],
	  height: 200
	});
});