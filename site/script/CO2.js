function initCO2(){
	tableTimes = [];


	var elems = document.getElementsByClassName("tableElement");
	var n = elems.length;
	console.log("Elements to update: " + n);
	var maxTime = get("rangeTop").value
	
	updateMaxTimeLabel();
	
	get("addRemoveContainer").style.display="none";

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
