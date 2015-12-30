
Template.tables.helpers({
	'tables': function(){
		return Meteor.user().profile.tables;
	}
});

Template.table.helpers({
	'table': function(){
		return getCorrectTable();
	},

	'rows': function(){	
		var table = getCorrectTable().table;
		stringTable = [];
		for(var i=0; i< table.length/2; i++){
			stringTable[i] = {
				'breathe' : moment.utc(table[i*2]*1000).format("mm:ss"),
				'hold': 	moment.utc(table[i*2+1]*1000).format("mm:ss")
			}
		}
		return stringTable;
	},

	'started': function(){
		return !!Session.get('started');
	}
});

Template.table.events({
	'click #start': function(){
		Session.set('started', true);
		Session.set('hideTabs',true);
		if (Meteor.isCordova) {
			window.plugins.insomnia.keepAwake();
		}
		var table = getCorrectTable();
		var durations = table.table;

		// construct array of countdowns
		var timers = $('.timer');
		countdowns = [];
		for(var i=0; i<durations.length; i++){
			countdowns.push(new Countdown(durations[i], timers[i]));
		}
		for(var i=0; i<countdowns.length-1; i++){
			countdowns[i].setNext(countdowns[i+1]);
		}
		countdowns[0].startCountdown();
	},

	'click #stop': function(){
        IonPopup.confirm({
            title: 'Do you really want to stop your current session??',
            'okText': 'Yes',
            onOk: function() {
				Session.set('started', false);
				Session.set('hideTabs',false);
				if (Meteor.isCordova) {
					window.plugins.insomnia.allowSleepAgain();
				}
				try{
					countdowns.forEach(function(countdown){
						countdown.reset();
					});
				} catch(e) {};
            }
        });

	}
});

Template.createTable.rendered = function(){
	Session.set('durations', [{'duration': 0},{'duration': 0}])
}

Template.createTable.helpers({
	'durations': function(){
		return Session.get('durations');
	}
});

Template.createTable.events({
	'click #addRow': function(){
		var durations = Session.get('durations');
		durations.push({'duration': 0});
		Session.set('durations', durations);
	},
	'click #save': function(){
		var name = $('#name').val();
		var description = $('#description').val();
		if(description.length <= 0){
			description = 'Custom table';
		}
		if(name.length >= 3){
			var table = [];
			var durations = $('.duration');
			for(j=0; j<durations.length; j++){
				var duration = Math.round(durations[j].value/1);
				table.push(duration);
				if(duration <= 0){
					alert('Please fill out every field');
					return;
				}
			}

			var tableObject = {
				'name': name,
      			'_id': new Meteor.Collection.ObjectID()._str,
				'description': description,
				'table': table
			}

			var profile = Meteor.user().profile;
			profile.tables.push(tableObject);
			Users.update({'_id': Meteor.userId()}, {$set: {'profile': profile }});
			IonModal.close();
		} else {
			alert('name too short');
		}
	}
});

function getCorrectTable(){
	var tables = Meteor.user().profile.tables;
	var found = null;
	tables.forEach(function (table) {
		if(table._id === Router.current().params._id){
			found = table;
			return;
		}
	});
	return found;
}


CO2table = function(){
	// returns CO2 table array
	var table = [];
	try{
		var maxTime = Meteor.user().profile.maxTime*10;
	} catch(e){
		var maxTime = 9;
	};	

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

	for(i=0; i<table.length; i++){
		table[i] = Math.round(table[i]);
	}
	return table
};

O2table = function(){
	// returns O2 table array
	var table = [];
	try{
		var maxTime = Meteor.user().profile.maxTime*10;
	} catch(e){
		var maxTime = 9;
	};
	

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

	for(i=0; i<table.length; i++){
		table[i] = Math.round(table[i]);
	}
	return table;
};
