//globas variables, they describe the whole state of the application
var sessionState = "stopped"; //running, paused and stopped are possible values
var breathing = true; //if breath stopwatch is running its true and otherwise false
var	stopwatch = [];
var tableTimes = [];
var customTableTimes = [];
get("table").innerHTML = normalHTML; //initialize

if(!localStorage.getItem("hasBeenHere")){
	//default settings
	localStorage.setItem("maxTime", 2);
	localStorage.setItem("mode", 1);

	get("rangeTop").value = 2
	get("CO2Radio").checked = true;
	loadLocal();
	localStorage.setItem("hasBeenHere",true);
}
else{
	loadLocal();
}

function startSession(arg){
	sessionState = "running";
	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	if(n != tableTimes.length){
		alert("Problem of Array lengths! \nArray: "+tableTimes.length + " \nElements: " + n);

	}

	get("startButtonImage").src="images/pause.gif";

	for(var i=0; i<n; i++)
		stopwatch[i] = new Stopwatch(elems[i], tableTimes[i]*1000*60,{delay: 10});
	for(var i=0; i<n-1; i++)
		stopwatch[i].setNext(stopwatch[i+1]);

	stopwatch[0].start();
}

function pauseSession(){
	sessionState = "paused";
	get("startButtonImage").src="images/play.gif";

	var runningStopwatch = {};
	for(var i=0; i<stopwatch.length; i++)
		if(stopwatch[i].isRunning())
			runningStopwatch = stopwatch[i];
	runningStopwatch.stop();
}

function continueSession(){
	sessionState = "running";
	get("startButtonImage").src="images/pause.gif";

	for(var i=0; i<stopwatch.length; i++)
		if(stopwatch[i].isRunning())
			runningStopwatch = stopwatch[i];
	runningStopwatch.start();
}

function onPlayButtonClicked(){
	switch(sessionState) {
		case "stopped":
		    startSession();
		    break;
		case "running":
		    pauseSession();
		    break;
		default:
		    continueSession();
		}
}

function stopSession(){
	get("startButtonImage").src="images/play.gif";
	sessionState = "stopped";

	for(var i=0; i<stopwatch.length; i++){
		stopwatch[i].stop();
		stopwatch[i].reset();
	}
}

function saveLocal(lastModeSelected){
	localStorage.setItem("maxTime", get("rangeTop").value);
	localStorage.setItem("mode", lastModeSelected);
	localStorage.setItem("customRowNumber",tableTimes.length/2);

	//I have to do this (save custom table)
	if(lastModeSelected == 3){
		log("we need to safe the custom array now. is as follows: ");
		log(tableTimes);
		//means we are in custom mode, so we have to save the tableTimes as well
		localStorage.setItem("tableTimes",JSON.stringify(tableTimes));
	}
}

function loadLocal(){
	var maxTime = localStorage.getItem("maxTime");
	get("rangeTop").value = maxTime;
	get("pickerTimeLabel").innerHTML = transformTime(maxTime*60*1000);


	var mode = localStorage.getItem("mode");
	if(mode == 1){
		get("CO2Radio").checked = true;
		initCO2();
	}
	else if(mode == 2){
		get("O2Radio").checked = true;
		initO2();
	}
	else{
		get("customRadio").checked = true;
		var loadedTimes = JSON.parse(localStorage.getItem("tableTimes"));
		initCustom(loadedTimes);		
	}
}

function updateMaxTimeLabel(){
	var maxTime = get("rangeTop").value;
	get("pickerTimeLabel").innerHTML = transformTime(maxTime*60*1000);
}