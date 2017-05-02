$(document).ready(function(){
	$(".js-example-basic-single").select2();
});
$(window).on('load resize', function () {
	var equalheight = $('.content-env-sec .styled-select label'),
		windowSize = $(window).width();
	if (windowSize <= 885 && windowSize >= 767 ){
		equalheight.css('height','45px');
	}else{
		equalheight.css('height','auto');
	}
});

$(function () {
	$("#btnShow").click(function(){
		$('#editModal').modal('show');
	});
});