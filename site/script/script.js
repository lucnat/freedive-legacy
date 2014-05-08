//globas variables
var input = document.getElementsByTagName("input")[0];
var tableTimes = [];
var customRows=1;

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


function addColumn(){	
	var titles = '<div class="tableTitle">Breathe</div> <div class="tableTitle">Hold</div><br>'
	var column = '<div class="tableElement timeLabel breathe"></div> <div class="tableElement timeLabel hold"></div><br>';
	var addButton = "<button id='addButton' onclick='addColumn()'>+ </button>Column";

	var HTML = titles;
	for(var i=0; i<customRows; i++) 
		HTML += column;
	HTML += addButton;
	document.getElementById("staticTable1").innerHTML = HTML;
	customRows++;
}


function startSession(){
	var	stopwatch = [];
	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;


	for(var i=0; i<n; i++) {
		stopwatch[i] = new Stopwatch(elems[i], tableTimes[i]*1000*60,{delay: 10});
	}
	for(var i=0; i<n-1; i++){
		stopwatch[i].setNext(stopwatch[i+1]);
	}

	stopwatch[0].start();

}

