Template.configure.helpers({
	'maxTime': function(){
		try{
			var maxTime = Meteor.user().profile.maxTime*10*1000;
			return moment.utc(maxTime).format("mm:ss");
		} catch(e) {};
	},
});


Template.configure.events({
	'change #maxTime': function(){
		var val = $('#maxTime').val();
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': val}});
		Session.set('maxTimeChanged', true);
	},

	'click #up': function(){
		var newTime = $('#maxTime').val()/1 + 1;
		$('#maxTime').val(newTime);
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': newTime}});
		Session.set('maxTimeChanged', true);
	},
	
	'click #down': function(){
		var newTime = $('#maxTime').val()/1 - 1;
		$('#maxTime').val(newTime);
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': newTime}});
		Session.set('maxTimeChanged', true);
	},

	'change #volume': function(){
		var val = $('#volume').val();
		var profile = Meteor.user().profile;
		profile.volume = val;
		Meteor.users.update( {'_id': Meteor.user()._id}, {$set: { profile: profile }});
	},

	'change #mute': function(){
		var profile = Meteor.user().profile;
		profile.muted = $('#mute')[0].checked;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }});
	},

	'change #vibrate': function(){
		var profile = Meteor.user().profile;
		profile.vibrate = $('#vibrate')[0].checked;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }});
	},
});

Template.configure.rendered = function(){
	var maxTime = Meteor.user().profile.maxTime;
	$('#maxTime').val(maxTime);
	var volume = Meteor.user().profile.volume;
	$('#volume').val(volume);
}

Template.configure.destroyed = function(){
	if(Session.get('maxTimeChanged')){
		console.log('loading new tables');
		var tables = Meteor.user().profile.tables;
		tables.forEach(function(table){
			if(table.name == 'CO2 Tolerance'){
				table.table = CO2table();
			} else if(table.name == 'O2 Deprivation'){
				table.table = O2table();
			}
		});
		Meteor.users.update({'_id': Meteor.userId()}, {$set: { 'profile.tables' : tables}});
		Session.set('maxTimeChanged', false);
	}
}