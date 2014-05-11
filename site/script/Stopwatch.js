function transformTime(clock){
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	return "" + Math.round(clock/1000/60-0.5) + ":" +pad(Math.round(clock/1000%60-0.5),2); 
}


var Stopwatch = function(elem, startingTime, options){
	var timer       = createTimer(),
		offset,
		clock,
		interval,
    	next,
    	running;

	// default options
	options = options || {};
	options.delay = options.delay || 1;

	//elem.appendChild(timer);

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

	function update() {
		if(clock > 0)
			clock -= delta();
		else{
			clock = 0;
			running = false;
			stop();
			if(next) {
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

	this.toString = function(){
		return "Stopwatch with starting Time " + startingTime;
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