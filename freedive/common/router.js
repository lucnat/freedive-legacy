Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'exercise'});
Router.route('/configure', {name: 'configure'});
Router.route('/profile', {name: 'profile'});
Router.route('/login', {name: 'login'});
Router.route('/firstLogin', {name: 'firstLogin'});

AccountsTemplates.configure({
  showLabels: false,
	focusFirstInput: false
});



var OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/login');
      } else {
      	this.next();
      }
    },
    firstLogin: function(){
    	if(Meteor.user().profile.firstLogin == true){
    		Router.go('/firstLogin');
    	} else {
    		this.next();
    	}
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['exercise', 'configure', 'profile']
});
Router.onBeforeAction(OnBeforeActions.firstLogin, {
    only: ['exercise', 'configure', 'profile']
});
