/* Section 1: Covering the Foundations
	Cache your scripts:
		- Use consistent URLs
		- set ETAGS and Expire rules
		- CDN 
*/


window.onload = function(){
	console.log('JavaScript High Performance');

	eval('startClocks();');

	var fun;
	 eval("fun = function(copy){console.log(copy);return 'he said:' + copy;}");

	console.log(fun("I talk to you"));
    
}

function startClocks(){
  var clock = new com.o2GEEK.AlarmClock('clock');
  var clock2 = new com.o2GEEK.TextClock('clock2',-300,'ETC');
  var clock2 = new com.o2GEEK.Clock('clock3',300,'X');

}

function LiveDate(a,b,c){
	console.log(this, a,b,c);
}

Date.__interval = 0;
Date.__aDates = [];
Date.addToInterval=function (date){
	//console.log(this.__interval);
	this.__aDates.push(date);

	if(!this.__interval)
		this.__interval = setInterval(function(){Date.updateDates()},1000);
}
Date.updateDates= function(){
	var scope = this;
    var prop = '__aDates';
    var aDates = eval('scope.' + prop);

	for(var i=0; i<aDates.length;i++){
		if(this.__aDates[i] instanceof Date)
			this.__aDates[i].updateSeconds();
		else if(this.__aDates[i] instanceof Function)
			this.__aDates[i]();
		else if(this.__aDates[i] && this.__aDates[i]['update'])
			this.__aDates[i].update();
	}
}


Date.prototype.updateSeconds = function(){
	this.setSeconds(this.getSeconds()+1);
	//console.log(Date.__interval);
}

Date.prototype.autoClock = function(isAuto){
	//clearInterval(this.clockInterval);

	if(isAuto){
		/*var that= this;
		this.clockInterval = setInterval(function(){that.updateSeconds()},1000);*/
		Date.addToInterval(this);
	}
}
var com = com || {};
	com.o2GEEK = com.o2GEEK || {};


com.o2GEEK.Clock = function (id,offset,label){
		this.version = '1.00';
		offset = offset || 0;
		label = label || '';
		var d = new Date();
		var offset = (offset+ d.getTimezoneOffset())*60*1000;
		this.d = new Date(offset+d.getTime());
		this.d.autoClock(true);
		this.id = id;
		this.label= label;
		 

	this.tick(true);
	var that = this;
	Date.addToInterval(function(){
		that.updateClock();});
	
}
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
				var date = this.d;
					//date.updateSeconds();
				var clock = document.getElementById(this.id);
				clock.innerHTML = this.formatOutput(date.getHours(),date.getMinutes(),date.getSeconds(),this.label) ;
			}
		};

com.o2GEEK.Clock.prototype.formatOutput = function(h,m,s,label){
	var output = this.formatDigits(h);
		output+= ":";
		output+= this.formatDigits(m);
		output+= ":";
		output+= this.formatDigits(s);
		output+= " ";
		output+= label;
	return output;
}


com.o2GEEK.Clock.prototype.formatDigits= function(val){
	if(val<10) val = "0" + val;

	return val;
};

com.o2GEEK.TextClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	console.log(this.version);

	this.formatOutput = function(h,m,s,label){
		return this.formatDigits(h) + " Hour " + this.formatDigits(m) +" Minutes "+ this.formatDigits(s) +" Seconds "+ label;
	}
}
com.o2GEEK.TextClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.TextClock);
//com.o2GEEK.TextClock.prototype.constructor = com.o2GEEK.TextClock;
//com.o2GEEK.TextClock.prototype.version = '1.01';

com.o2GEEK.AlarmClock = function(id,offset,label){
	com.o2GEEK.Clock.apply(this,arguments);
	
	console.log(this.version);

	this.doUpdate = true;
	this.dom = document.getElementById(id);
	this.dom.contentEditable = true;
	var that = this;
	this.dom.addEventListener('focus',function(e){
		this.innerHTML = this.innerHTML.slice(0,this.innerHTML.lastIndexOf(':'));
		that.tick(false);
	});
	this.dom.addEventListener('blur',function(e){
		var a = this.innerHTML.split(':');
		that.almH = parseInt(a[0]);
		that.almM = parseInt(a[1]);
		if((that.almH>=0 && that.almH<24) &&
			(that.almM>=0 && that.almM<60)	 ){
			var event = new Event('restart_tick');
			this.dispatchEvent(event);
		}

		console.log(that.almH,that.almM);
		
	});

	this.dom.addEventListener('restart_tick',function(){
		that.tick(true);
	})
	
}

com.o2GEEK.AlarmClock.prototype = createObject(com.o2GEEK.Clock.prototype,com.o2GEEK.AlarmClock);


com.o2GEEK.AlarmClock.prototype.formatOutput= function(h,m,s,label){
	var output;
	if(h==this.almH && m==this.almM){
		output= 'ALARM WAKE UP';
		var snd = new Audio('art/beep.mp3');
			snd.play();
	}else
		output= com.o2GEEK.Clock.prototype.formatOutput.apply(this,arguments);

	return output;
}






function createObject(proto,cons){
	function c(){}
	c.prototype = proto;
	c.prototype.constructor = cons;
	return new c();
}


//follow me at https://twitter.com/02geek
//learn more about me at http://02geek.com