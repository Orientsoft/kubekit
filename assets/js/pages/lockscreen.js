$(function(){
	resizefunc.push("arrangesizeLockscreen");
	$(".lock-page .login-wrap").addClass("animated flipInX");
});

function arrangesizeLockscreen(){
	$(".lock-page").height($(window).height());	
}