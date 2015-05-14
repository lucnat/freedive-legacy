Template.profile.events({
	'click #logout': function(){
		Meteor.logout(function(){
			Router.go('/');
		});
	}
});