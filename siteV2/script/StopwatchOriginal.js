/*

API: 

var elem = document.getElemenById("#my-stopwatch");
var timer = new Stopwatch(elem, {delay: 10});

// start the timer
timer.start();

// stop the timer
timer.stop();

// reset the timer
timer.reset();

timer.setNext(next) is the timer that should run when timer comes to time 0.

*/


var Stopwatch = function(elem, startingTime, options) {

  var timer       = createTimer(),
      startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),

      offset,
      clock,
      interval,
      next;


  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements     
  
  elem.appendChild(timer);
  /*
  elem.appendChild(startButton);
  elem.appendChild(stopButton);
  elem.appendChild(resetButton);
  */

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
    render();
  }

  function update() {

    if(clock > 0)
      clock -= delta();
    else{
      clock = 0;
      stop();

      next.start();
    }

    render();
  }

  function render() {

    function pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
    }

    timer.innerHTML = "" + Math.round(clock/1000/60) + ":" +pad(Math.round(clock/1000),2); 
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

};
