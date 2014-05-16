function initCustom(loadedTableTimes){
	var table = get("table");
	table.innerHTML = "";
	updateMaxTimeLabel();
	get("addRemoveContainer").style.display = "";
	var breatheTitle = dom("DIV", {class: "tableTitle"},"Breathe");
	var holdTitle = dom("DIV", {class: "tableTitle"},"Hold");
	table.appendChild(breatheTitle); table.appendChild(holdTitle); table.appendChild(dom("BR"));

	if(loadedTableTimes){
		tableTimes = loadedTableTimes;
		rowsToAdd = customRowNumber-1;
		customRowNumber = 1;
		for(var i=0; i<rowsToAdd; i++){
			addRow(tableTimes[2*i],tableTimes[2*i+1]);
			log("addRow called");
		}
	}
	else{
		customRowNumber = 1;
		tableTimes = [];

		for(var i=0; i<6; i++)
			addRow();
	}
}

function onCustomRangeChanged(event){
	//Finds the corresponding element and changes it's value
	if(event.id <= 100){
		var newValue = event.value;
		var breathTimeLabel = get("breathTimeLabel"+event.id);
		var tableId = (2*event.id-2);
		breathTimeLabel.innerHTML = transformTime(newValue*60*1000);
		tableTimes[tableId] = newValue;
	}
	else{
		var newValue = event.value;
		var newValue = event.value;
		var holdTimeLabel = get("holdTimeLabel"+(event.id-100));
		var tableId = (2*(event.id-100)-1);
		holdTimeLabel.innerHTML = transformTime(event.value*60*1000);
		tableTimes[tableId] = newValue;
	}
}

function addRow(breathTime, holdTime){	

	var breathLabelId = "breathTimeLabel"+customRowNumber;
	var breathInputId = ""+customRowNumber
	var breathLabel = "";

	console.log("passed breathTtime " + breathTime + " and holdTime " + holdTime);
	if(breathTime)
		breathLabel += transformTime(breathTime);
	else
		breathLabel = "2:00"
	var breatheTimeLabel = dom("LABEL", {
		id: breathLabelId,
		class: "customTimeLabels timeLabel",
	}, breathLabel);

	var input = dom("INPUT",{
		id: breathInputId,
		class: "rangeCustom",
		type: "range",
		step: "0.25",
		name: "time",
		min: "0",
		max: get("rangeTop").value,
		value: "2",
		onchange: "onCustomRangeChanged(this)",
	});

	var breathElement = dom("DIV", {class: "tableElement timeLabel breathe"}, breatheTimeLabel, input);


	var holdLabelId = "holdTimeLabel"+customRowNumber;
	var holdInputId = customRowNumber+100+ ""
	var holdLabel = "";
	if(holdTime)
		holdLabel +=transformTime(breathTime);
	else
		holdLabel = "2:00"

	var holdTimeLabel = dom("LABEL", {
		id: holdLabelId,
		class: "customTimeLabels timeLabel",
	}, holdLabel);

	var input = dom("INPUT",{
		id: holdInputId,
		class: "rangeCustom",
		type: "range",
		step: "0.25",
		name: "time",
		min: "0",
		max: get("rangeTop").value,
		value: 2,
		onchange: "onCustomRangeChanged(this)",
	});

	var holdElement = dom("DIV", {class: "tableElement timeLabel hold"}, holdTimeLabel, input);

	var row = dom("DIV", {id: "row"+customRowNumber}, breathElement, holdElement);

	get("table").appendChild(row);
	//get("table").appendChild(holdElement)
	get("table").appendChild(dom("BR"));

	tableTimes[2*customRowNumber-2] = 2;
	tableTimes[2*customRowNumber-1] = 2;
	customRowNumber++;
	saveLocal(3);
}

function removeRow(){
	if(customRowNumber > 1){
		get("row"+(customRowNumber-1)).remove();
		tableTimes.pop();
		tableTimes.pop();
		customRowNumber -= 1;

		saveLocal();
	}
	else
		alert("All rows have already been removed.");
	saveLocal(3);
}