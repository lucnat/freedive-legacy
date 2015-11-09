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
	},
	'started': function(){
		return Session.get('session') === 'started';
	},
	'paused': function(){
		return Session.get('session') === 'paused';
	},
	'stopped': function(){
		return Session.get('session') === 'stopped';
	},
});

Template.exercise.events({
	'click #start': function(){
		if(! (Session.get('session') === 'started')){
			console.log('Session started.');
			i = 0;
			Session.set('session','started');
			Session.set('hideTabs',true);
			startCountdown();
		}
	if (Meteor.isCordova) {
			if (AdMob) {
				AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER)
			}
			window.plugins.insomnia.keepAwake();
		}
	},
	'click #stop': function(){
        IonPopup.confirm({
            title: 'End Session?',
            template: 'This will stop your current session.',
            onOk: function() {
				Session.set('hideTabs',false);
				stop();
				if (Meteor.isCordova) {
					if (AdMob) {
						AdMob.showBannerAtXY(0,window.innerHeight-99);
					}
					window.plugins.insomnia.allowSleepAgain();
				}
            },
            onCancel: function() {
            }
        });

	},
	'click #pause': function(){
		Meteor.clearInterval(Session.get('currentTimer'));
		Session.set('session', 'paused');
	}
});

Template.exercise.rendered = function(){
	if(! Session.get('firstInitDone')){
		changeStyling();
		$($('.timer')[0]).css('background-color', '#99E699');
		Session.set('firstInitDone', true);
	}
	resetTable();
	changeStyling();
}

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

startCountdown = function(){
	//starts countdown of element i
	if(i%2 == 0){
		playSound('breathe');
	}
	else{
		playSound('hold');
	}
	console.log('called');
	changeStyling();
	startTimer(i, function(){
		startCountdown();
	});

	i++;
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
	// returns O2 table array
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

stop = function(){
	Meteor.clearInterval(Session.get('currentTimer'));
	resetTable();
	Session.set('session', 'stopped');
	console.log('Session stopped!');

	// make the element at which we stopped white
	var rawElement = $('.timer')[i];
	var jqueryElement = $(rawElement);
	jqueryElement.css('background-color','white');
}

changeStyling = function(){
	console.log('changing styling');
	// try to styling to the new element
	try{
		var rawElement = $('.timer')[i];
		var jqueryElement = $(rawElement);
		if(i%2 == 0){
			jqueryElement.css('background-color', '#99E699');

		} else{
			jqueryElement.css('background-color', '#FF9494');
		}
	} catch(e) {};

	// now lets try to remove styling from the preceding element
	try{
		var beforeRawElement = $('.timer')[i-1];
		var beforeJQueryElement = $(beforeRawElement);
		beforeJQueryElement.css('background-color', 'white');

	} catch(e){};
}

Meteor.startup(function(){
	Session.set('session','stopped');
});

decreaseTimes = function(){
	for(var j=0; j<timeTable.length; j++){
		timeTable[j] = 5;
	}
	timeTable.changed();
};