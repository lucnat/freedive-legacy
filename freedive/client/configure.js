Template.configure.helpers({
	'maxTime': function(){
		try{
			return transformTime(Meteor.user().profile.maxTime*10*1000);
		} catch(e) {};
	},
});

Template.configure.events({
	'change #maxTime': function(){
		var val = $('#maxTime').val();
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': val}});
		stop();
	},

	'click #up': function(){
		var newTime = $('#maxTime').val()/1 + 1;
		$('#maxTime').val(newTime);
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': newTime}});
	},
	
	'click #down': function(){
		var newTime = $('#maxTime').val()/1 - 1;
		$('#maxTime').val(newTime);
		Users.update({'_id': Meteor.userId()}, {$set: {'profile.maxTime': newTime}});
	},

	'click #changebackward': function(){
		var profile = Meteor.user().profile;
		profile.CO2Mode = true;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }});
		stop();
	},

	'click #changeforward': function(){
		var profile = Meteor.user().profile;
		profile.CO2Mode = false;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }});
		stop();
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

Template.readmore.rendered = function(){
	
}