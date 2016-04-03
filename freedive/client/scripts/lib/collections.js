
Tables = new Ground.Collection('tables', { connection: null });
Users = new Ground.Collection('users', {connection: null });
Holds = new Ground.Collection('holds', {connection: null });


Tracker.autorun(function(){
	if(Ground.ready()){
		fixtures();
	}
});

function fixtures(){
	// User Fixtures
	if(!Users.findOne()){
		console.log('Executing user fixtures...');
		var defaultUser = {
			'maxTime': 	90,
			'mute': 	true,
			'vibrate': 	false,
			'volume': 	20,
			'notificationMarks': [30,10,5,4,3,2,1]
		};

		Users.insert(defaultUser);
	}

	if(Users.find().count() > 1){
		Users.remove({});
	}

	// Auto-generated table fixtures
	if(!Tables.findOne({'description': 'Auto-generated'})){
		console.log('Executing table fixtures');

		var CO2 = {
			'name': 		'CO2 Tolerance',
			'description': 	'Auto-generated',
			'durations': 	CO2table()
		}

		var O2 = {
			'name': 		'O2 Deprivation',
			'description': 	'Auto-generated',
			'durations': 	O2table()
		}

		Tables.insert(CO2);
		Tables.insert(O2);
	}

	if(Tables.find({'description': 'Auto-generated'}).count() > 2){
		Tables.remove({});
	}
}
