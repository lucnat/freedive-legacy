Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'tables'});
Router.route('/table/:_id', {name: 'table'});
Router.route('/hold', {name: 'hold'});
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

var onlyWhenLoggedIn = ['tables', 'table', 'hold', 'configure', 'profile'];

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: onlyWhenLoggedIn
});
Router.onBeforeAction(OnBeforeActions.firstLogin, {
    only: onlyWhenLoggedIn
});
