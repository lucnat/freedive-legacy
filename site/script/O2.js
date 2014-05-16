function initO2(){
	tableTimes = [];

	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	var input = document.getElementsByTagName("input")[0];
	var maxTime = input.value*60;
	
	updateMaxTimeLabel();
	get("addRemoveContainer").style.display = "none";

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
