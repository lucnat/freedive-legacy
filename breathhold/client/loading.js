Template.loading.rendered = function(){
	if(Meteor.user() || Meteor.loggingIn()){
		Router.go('/configure');
	} else {
		Router.go('/login');
	}
}