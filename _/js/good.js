/* Section 1: Covering the Foundations
	Cache your scripts:
		- Use consistent URLs
		- set ETAGS and Expire rules
		- CDN 
	Minify your CSS/JS:
	 http://tools.w3clubs.com/cssmin/
	 https://code.google.com/p/minify/downloads/list

  Section 5: 
    - Recomended Animation Library:
      http://greensock.com/
*/


function onReady(){
	console.log('JavaScript High Performance');
	//console.log(window.com.o2GEEK.AlarmClock);
	jQuery.fx.interval = 40;
	//window.startClocks();

	var d = new Date(1940,12,1);
	//console.log(d.getTime());


	var fun = new Function("copy","console.log(copy);return 'he said:' + copy;");
	 //eval("fun = function(copy){console.log(copy);return 'he said:' + copy;}");

	 //obj[key]
	 //window[key]()

	console.log(fun("I talk to you"));

    startClocks();
    setupForm();
}

function startClocks(){
  var clock = new com.o2GEEK.AlarmClock('clock');
  var clock2 = new com.o2GEEK.TextClock('clock2',-300,'ETC');
  var clock3 = new com.o2GEEK.Clock('clock3',300,'X');

  $.getScript('http://code.jquery.com/ui/1.11.3/jquery-ui.min.js',startCreativeClock);
}

function setupForm(){
	/*var data = jQuery.makeArray(document.forms[0]);
	var l = data.length;
	var aOut=new Array(l);

	for(var i=0; i<l; i++){
		aOut[i] = data[i];
	}*/

	if(!$('#mce-EMAIL')[0].checkValidity){
		$('#subscribe').submit(function(e){
			if(!isEmail($('#mce-EMAIL').val())){
				e.preventDefault();
				//message user
			}

		});
	}
}

function isEmail(eml){
	var rx = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return rx.test(eml);

}

function startCreativeClock(){
  var clock4 = new com.o2GEEK.CreativeClock('clockbase');
}

Date.__interval = 0;
Date.__aDates = [];

Date.addToInterval = function(date){
	this.__aDates.push(date);

	if(!this.__interval)
		this.__interval = setInterval($.proxy(this.updateDates,this),1000);
}

Date.updateDates = function(){
	var a = this.__aDates,
		len = a.length,
		i,
		dt;

	for(i=0; i<len; i++){
		dt = a[i];
		if(dt instanceof Date)
			dt.updateSeconds();
		else if(dt instanceof Function)
			dt();
		else if(dt && dt['update'])
			dt.update();

	}

}


Date.prototype.updateSeconds = function(){
	this.setSeconds(this.getSeconds()+1);
	//console.log(Date.__interval);
}

Date.prototype.autoClock = function(isAuto){
	clearInterval(this.clockInterval);

	if(isAuto){
		Date.addToInterval(this);
	}
}

String.prototype.repeat = function(count){
	return new Array(count+1).join(this);
}


var com = com || {};
	com.o2GEEK = com.o2GEEK || {};


com.o2GEEK.Clock = function (id,offset,label){

		offset = offset || 0;
		label = label || '';
		var d = new Date(),
			offset = (offset+ d.getTimezoneOffset())*60*1000;
		this.d = new Date(offset+d.getTime());
		this.d.autoClock(true);
		this.id = id;
		this.label= label;
		 

	this.tick(true);

    Date.addToInterval($.proxy(this.updateClock,this));
	
}
com.o2GEEK.Clock.prototype.version = '1.00';
com.o2GEEK.Clock.prototype.tick=function(isTick){
	//clearInterval(this.myInternalInterval);
	this.isTicking = isTick;
	/*if(isTick){
		var that = this;
		this.myInternalInterval = setInterval(function(){
		that.updateClock();},1000);
		this.updateClock();
	}*/
}

com.o2GEEK.Clock.prototype.updateClock = function(){
			if(this.isTicking){
				var date = this.d,
					//date.updateSeconds();
					clock = document.getElementById(this.id);
				clock.innerHTML = this.formatOutput(date.getHours(),date.getMinutes(),date.getSeconds(),this.label) ;
			}
		};

com.o2GEEK.Clock.prototype.formatOutput = function(h,m,s,label){

	return this.formatDigits(h) + 
				":" +
			    this.formatDigits(m) +
				":" +
				this.formatDigits(s)+
				" "+
				label;
}


com.o2GEEK.Clock.prototype.formatDigits= function(val){
	if(val<10) val = "0" + val;

	return val;
};

com.o2GEEK.TextClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	console.log(this.version);

	
}
com.o2GEEK.TextClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.TextClock);
//com.o2GEEK.TextClock.prototype.constructor = com.o2GEEK.TextClock;
//com.o2GEEK.TextClock.prototype.version = '1.01';
com.o2GEEK.TextClock.prototype.formatOutput = function(h,m,s,label){
		var out= ['H'],
			i=0;
		for(; i<h;i++){
			out.push(".");
		}
		
		out.push('<br/>M');
		
		for(i=0; i<m;i++){
			out.push(".");
		}
		
		out.push('<br/>S');
		
		for(i=0; i<s;i++){
			out.push(".");
		}
		
		out.push('<br/>'+label);

		//this.formatDigits(h) + " Hour " + this.formatDigits(m) +" Minutes "+ this.formatDigits(s) +" Seconds "+ label
		return out.join("");
	}

com.o2GEEK.AlarmClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	
	console.log(this.version);

	this.doUpdate = true;

	var dom = this.dom = $("#"+id);
		dom.attr('contentEditable', true);
		dom.on('focus',$.proxy(this.onFocus,this));
		dom.on('blur',$.proxy(this.onBlur,this));
		dom.on('restart_tick',$.proxy(this.onReset,this));
	
}

com.o2GEEK.AlarmClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.AlarmClock);

com.o2GEEK.AlarmClock.prototype.onFocus =function(e){

		var dom =e.target;
		dom.innerHTML = dom.innerHTML.slice(0,dom.innerHTML.lastIndexOf(':'));
		this.tick(false);
};

com.o2GEEK.AlarmClock.prototype.onBlur =function(e){
		var dom = e.target;
		var a = dom.innerHTML.split(':'),
			almH = this.almH = parseInt(a[0]),
			almM = this.almM = parseInt(a[1]),
			event;
		if((almH>=0 && almH<24) &&
			(almM>=0 && almM<60)	 ){
			event = new Event('restart_tick');
			dom.dispatchEvent(event);
		}

		console.log(almH,almM);
};

com.o2GEEK.AlarmClock.prototype.onReset =function(){
		this.tick(true);
	}



com.o2GEEK.AlarmClock.prototype.formatOutput= function(h,m,s,label){
	var output,
		snd;
	if(h===this.almH && m===this.almM){
		output= 'ALARM WAKE UP';
		snd = new Audio('art/beep.mp3');
		snd.play();
	}else
		output= com.o2GEEK.Clock.prototype.formatOutput.apply(this,arguments);

	return output;
}
com.o2GEEK.CreativeClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	var date = this.d,
		h = date.getHours(),
		win = $(window),
		width = win.width(),
		height = win.height(),
		m = date.getMinutes(),
		s = date.getSeconds();

	this.formatDigits('circleH',0,h,width,height);
	this.formatDigits('circleM',0,m,width,height);
	this.formatDigits('circleS',0,s,width,height);

	$("#"+this.id).on('click',$.proxy(this.onClick,this));

}
com.o2GEEK.CreativeClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.CreativeClock);

com.o2GEEK.CreativeClock.prototype.lastItems = [];
com.o2GEEK.CreativeClock.prototype.onClick = function(e){
		var item = $(e.target);
			item.remove();
			item.off();
};


com.o2GEEK.CreativeClock.prototype.updateClock = function(){
	if(this.isTicking){
		var date = this.d,
			width = $(window).width(),
			height = $(window).height(),
			i,
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds(),
			si = s-1;
		
		if(s === 0){
			//console.log("#"+this.id);
			$("#"+this.id).html('');
			
			//this.aCircles.length = 0;
			//console.log(this.aCircles.length);
			
			this.formatDigits('circleH',0,h,width,height);
			this.formatDigits('circleM',0,m,width,height);
			if(s!==0) this.formatDigits('circleS',0,s,width,height);
		}else{
			this.formatDigits('circleS',si,s,width,height);
		}
		
	}
};

com.o2GEEK.CreativeClock.prototype.formatDigits=function(cls,index,count,width,height){
	var i, ref,
		body = $("#"+this.id),	
		sDiv = ["<div class='",cls,"' style='top:",(height/2),"px;left:",(width/2),"px;'></div>"].join(""),
		id = cls + this.d.getTime();

	count = count-index;
	index = 0;
	sDiv = ["<div id='",id,"' style='position:aboslute; top:0px; left:0px;' class='hidden'>" , sDiv.repeat(count) , "</div>"].join("");

	body.append(sDiv);
	ref = $("#"+id+" div");
	$("#"+id).switchClass('hidden','visible',200);

	for( i=index; i<count;i++){		
		$(ref[i]).animate({top:Math.floor(Math.random()*height-50),
			left:Math.floor(Math.random()*width)-50},1000);	
	}

	//div.css('left', left);
		//div.css('top', top);
	/*div.on('click',function(){
			$(this).remove();
			$(this).off();
		});*/

}


function createObject(proto,cons){
	function c(){}
	c.prototype = proto;
	c.prototype.constructor = cons;
	return new c();
}

window.onload = onReady;

//follow me at https://twitter.com/02geek
//learn more about me at http://02geek.com