var breathSound = new Audio(); 		breathSound.src="sounds/breathe.mp3"; 		breathSound.volume = 0.7;
var holdSound = new Audio(); 		holdSound.src="sounds/hold.mp3";			holdSound.volume = 0.7;
var tenSeconds = new Audio(); 		tenSeconds.src="sounds/10seconds.mp3";		tenSeconds.volume = 0.7;
var thirtySeconds = new Audio(); 	thirtySeconds.src="sounds/30seconds.mp3";	thirtySeconds.volume = 0.7;

function transformTime(clock){
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	return "" + Math.round(clock/1000/60-0.5) + ":" +pad(Math.round(clock/1000%60-0.5),2); 
}


function hasClass(element, cls) {
	//return true, if element contains class "cls" and false otherwise
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


var Stopwatch = function(elem, startingTime, options){
	var timer       = createTimer(),
		offset,
		clock,
		interval,
    	next,
    	running,
    	tenSecondsPlayed = startingTime < 10000,
    	thirtySecondsPlayed = startingTime < 30000;

	// default options
	options = options || {};
	options.delay = options.delay || 1;

	// initialize
	reset();

	// private functions
	function createTimer() {
		return document.createElement("span");
	}

	function createButton(action, handler) {
		var a = document.createElement("a");
		a.href = "#" + action;
		a.innerHTML = action;
		a.addEventListener("click", function(event) {
			handler();
			event.preventDefault();
		});
		return a;
	}

	function start() {

		//which sound to play? check element!
		if (hasClass(elem, "breathe"))
			breathSound.play();
		else
			holdSound.play();

		running = true;
		if (!interval) {
			offset   = Date.now();
			interval = setInterval(update, options.delay);
		}
	}

	function stop() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function reset() {
		clock = startingTime;
		running = false;
		render();
	}
	
	function playRemainingSoundsIfNeeded(){
		if(!thirtySecondsPlayed && clock < 31000){
			thirtySeconds.play();
			thirtySecondsPlayed = true;
		}
		if(!tenSecondsPlayed && clock < 11000){
			tenSeconds.play();
			tenSecondsPlayed = true;
		}

	}

	function update() {

		if(clock > 0){
			playRemainingSoundsIfNeeded();
			clock -= delta();
		}
		else{
			clock = 0;
			render();
			running = false;
			stop();
			if(next) {
				breathing = !breathing;
				next.start();
			}
		}
		render();
	}

	function render() {
		if(clock > 0){
			elem.innerHTML = transformTime(clock);			
		}
	}

	function delta() {
		var now = Date.now(),
		d   = now - offset;
		offset = now;
		return d;
	}

	this.log = function(){
		console.log("started at " + startingTime + " in element ");
		console.log(elem);
		console.log("next: starts at " + startingTime + " in element ")
		console.log(next.elem);
	}

	// public API
	this.start  = start;
	this.stop   = stop;
	this.reset  = reset;
	this.setNext = function(nextStopwatch){
	next = nextStopwatch;
	}

	this.isRunning = function(){
		return running;
	}

}