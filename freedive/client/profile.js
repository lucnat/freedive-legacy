Template.profile.events({
	'click #logout': function(){
		Meteor.logout(function(){
			Router.go('/login');
		});
	}
});

Template.firstLogin.events({
	'click button': function(){
		var profile = Users.findOne(Meteor.userId()).profile;
		profile.firstLogin = false;
		Users.update({'_id': Meteor.userId()}, {$set: { 'profile': profile }});
		Router.go('/configure');
	}
});