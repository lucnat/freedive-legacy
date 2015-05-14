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
		var profile = Meteor.user().profile;
		profile.maxTime = val;
		Meteor.users.update( {'_id': Meteor.user()._id}, {$set: { profile: profile }});
	},

	'click #changebackward': function(){
		var profile = Meteor.user().profile;
		profile.CO2Mode = true;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }})
	},

	'click #changeforward': function(){
		var profile = Meteor.user().profile;
		profile.CO2Mode = false;
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: profile }})
	},
});

Template.configure.rendered = function(){
	try{
		var maxTime = Meteor.user().profile.maxTime;
		$('#maxTime').val(maxTime);
		
	} catch(e) {};
}

Accounts.onLogin(function(){
	if(!Meteor.user().profile){
		Meteor.users.update({'_id': Meteor.user()._id}, {$set: {profile: {maxTime: 9, CO2Mode: true}}});
	}

	try{
		var maxTime = Meteor.user().profile.maxTime;
		$('#maxTime').val(maxTime);
		
	} catch(e) {};

});

