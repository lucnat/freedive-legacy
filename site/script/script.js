//globas variables
var input = document.getElementsByTagName("input")[0];
var tableTimes = [];
var customRowNumber=1;
var	stopwatch = [];


//default settings
input.value = 2
initCO2();
HTML = document.getElementById("staticTable1").innerHTML;
document.getElementById("CO2Radio").checked = true;

function initCO2(){
	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	var input = document.getElementsByTagName("input")[0];
	var maxTime = input.value;
	
	var maxTimeLabel = document.getElementById("pickerTimeLabel");
	maxTimeLabel.innerHTML = transformTime(maxTime*60*1000);

	var breathTime = 2.75;

	for(var i=0; i<n; i++){
		if(i%2==0){	//breath
			breathTime -= 0.25;
			if(breathTime < 1)
				tableTimes[i] = 1;
			else
				tableTimes[i] = breathTime;
		} //hold
		else tableTimes[i] = maxTime/2; 
	}

	for(var i=0; i<n; i++) elems[i].innerHTML = transformTime(tableTimes[i]*1000*60);
}

function initO2(){

	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	var input = document.getElementsByTagName("input")[0];
	var maxTime = input.value*60;
	
	var maxTimeLabel = document.getElementById("pickerTimeLabel");
	maxTimeLabel.innerHTML = transformTime(maxTime*1000);

	var step = maxTime/12;
	var lowerLimit = 4*step;
	var upperLimit = maxTime-2*step;
	var holdTime = lowerLimit

	for(var i=0; i<n; i++){
		if(i%2==0) //breath
			tableTimes[i] = 2*60;
		else{ //hold
			if(holdTime < upperLimit){
				tableTimes[i] = holdTime;
			}
			else tableTimes[i] = upperLimit;
			holdTime += step;
		} 
	}

	//war alles in Sekunden müssen in Minuten:
	for(var i=0; i<n; i++) {
		tableTimes[i] = tableTimes[i]/60;
		elems[i].innerHTML = transformTime(tableTimes[i]*1000*60);
	}
}

function initCustom(){
	var titles = '<div class="tableTitle">Breathe</div> <div class="tableTitle">Hold</div><br>'
	var addButton = "<button id='addButton' onclick='addColumn()'>+ </button> Column";
	document.getElementById("staticTable1").innerHTML = titles + addButton;
}

function pausePressed(){
	var button = document.getElementById("pauseButton");
	var runningStopwatch = {};
	for(var i=0; i<stopwatch.length; i++)
		if(stopwatch[i].isRunning())
			runningStopwatch = stopwatch[i];

	if(button.innerHTML=="Pause"){
		runningStopwatch.stop();
		button.innerHTML="Resume";
	}
	else{
		runningStopwatch.start();
		button.innerHTML="Pause";
	}
}

var onchange = {}
function addColumn(){	
	var labelString = "customLabel"+customRowNumber;
	var titles = '<div class="tableTitle">Breathe</div> <div class="tableTitle">Hold</div><br>';
	var timeLabel = '<label id='+labelString+' class="customTimeLabels timeLabel">2:00</label>';
	var quote="'";
	onchange = function(value){
		document.getElementById(labelString).innerHTML=transformTime(value*60*100);
	}
	var input = ' <input id = "rangeCustom" type="range" step ="0.25" name="time" min="0" max="4" value="2" onchange="onchange(this.value);"></div>';
	var breathElement = '<div class="tableElement breathe">'+timeLabel+input+'</div>';
	var holdElement = '<div class="tableElement hold">'+timeLabel+input+'</div>';
	var row = breathElement+holdElement+'<br>';
	var addButton = "<button id='addButton' onclick='addColumn()'>+ </button> Add Column";

	var HTML = titles;
	for(var i=0; i<customRowNumber; i++) 
		HTML += row;
	HTML += addButton;
	document.getElementById("staticTable1").innerHTML = HTML;
	console.log(document.getElementById("rangeCustom"));
	customRowNumber++;
}


function startSession(){
	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	document.getElementById("pauseButton").innerHTML="Pause";


	for(var i=0; i<n; i++) {
		stopwatch[i] = new Stopwatch(elems[i], tableTimes[i]*1000*60,{delay: 10});
	}
	for(var i=0; i<n-1; i++){
		stopwatch[i].setNext(stopwatch[i+1]);
	}

	stopwatch[0].start();
}

