var fps = $('#fps'),
	aColors = ['#65868D','#EA872E'],
	count = 0,
	lastVal,
	time = window.performance.now();

fps.animate({backgroundColor:aColors[0]},1000,onFPSAnimDone);

function onFPSAnimDone(){
	var index = fps.data('index')==1 ? 0:1;
				fps.data('index',index);
	fps.animate({backgroundColor:aColors[index]},1000,onFPSAnimDone);
}

setInterval(function(){
	var fpsVal = fps.css('backgroundColor'),
		sinceStart;
	if(lastVal!== fpsVal){
		lastVal = fpsVal;
		count++;
		sinceStart = window.performance.now()-time;
		fps.text(1000/(sinceStart/count))

	}
},10);
