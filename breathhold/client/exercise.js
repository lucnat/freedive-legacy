timeTable = new ReactiveArray([]);
i = 0;

Template.exercise.helpers({
	'rows': function(){	
		stringTable = [];
		for(var i=0; i<timeTable.list().length/2; i++){
			stringTable[i] = {
				'breathe' : transformTime(timeTable.list()[i*2]*1000),
				'hold': 	transformTime(timeTable.list()[i*2+1]*1000),
			}
		}
		return stringTable;
	}
});

Template.exercise.events({
	'click #start': function(){
		i = 0;
		Session.set('sessionStarted', true);
		console.log('session started!');
		startCountdown();
		$('#start').hide();
		$('#pause').show();
	},
	'click #stop': function(){
		Meteor.clearInterval(Session.get('currentTimer'));
		resetTable();
		$('#start').show();
		$('#pause').hide();

	},
	'click #pause': function(){
		Meteor.clearInterval(Session.get('currentTimer'));
		$('#start').show();
		$('#pause').hide();

	}
});

transformTime = function(clock){
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	return "" + Math.round(clock/1000/60-0.5) + ":" +pad(Math.round(clock/1000%60-0.5),2); 
}
	
resetTable = function(){
	console.log('resetting Table...');
	i = 0;

	try{
		timeTable.clear()
		if(Meteor.user().profile.CO2Mode){
			timeTable = new ReactiveArray(CO2table());
			timeTable.changed();
		}
		else {
			timeTable = new ReactiveArray(O2table());
			timeTable.changed();
		}
	} catch(e) {console.log(e)};

	for(var j=0; j<timeTable.length; j++) 
		timeTable[j] = Math.round(timeTable[j]);
	timeTable.changed();
};

CO2table = function(){
	table = [];

	var maxTime = Meteor.user().profile.maxTime*10;
	var breathTime = 165;

	for(var i=0; i<16; i++){
		if(i%2==0){	
			//breath
			breathTime -= 15;
			if(breathTime < 60)
				table[i] = 60;
			else
				table[i] = breathTime;
		} 
		//hold
		else table[i] = maxTime*1.0/2; 
	}

	return table
};

O2table = function(){
	var table = [];
	var maxTime = Meteor.user().profile.maxTime*10;
	var step = maxTime/12;
	var lowerLimit = 4*step;
	var upperLimit = maxTime-2*step;
	var holdTime = lowerLimit

	for(var i=0; i<16; i++){
		if(i%2==0) //breath
			table[i] = 120;
		else{ //hold
			if(holdTime < upperLimit){
				table[i] = holdTime;
			}
			else table[i] = upperLimit;
			holdTime += step;
		} 
	}
	return table;
};

startCountdown = function(){
	//starts countdown of element i
	if(i%2 == 0) 
		new buzz.sound('/breathe.mp3').play()
	else
		new buzz.sound('/hold.mp3').play();

	startTimer(i, function(){
		startCountdown();
	});

	i++;
}

Tracker.autorun(function(){
	try{
		resetTable();
	} catch(e) {};
});
