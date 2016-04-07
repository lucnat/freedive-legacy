
Tables 	= new LucDB('tables');
User 	= new LucDB('User');
Holds 	= new LucDB('holds');

function userFixtures(){
	if(!User.get()){
		console.log('executing user fixtures');
		var defaultUser = {
			'maxTime': 	90,
			'mute': 	true,
			'vibrate': 	false,
			'volume': 	20,
			'notificationMarks': [30,10,5,4,3,2,1]
		};
		User.set(defaultUser);
	}
}

function tableFixtures(){
	if(!Tables.get()){

		Tables.set([]);

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
}

function holdFixtures(){
	if(!Holds.get()){
		Holds.set([]);
	}
}


userFixtures();
tableFixtures();
holdFixtures();