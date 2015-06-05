Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'loading'});
Router.route('/exercise', {name: 'exercise'});
Router.route('/configure', {name: 'configure'});
Router.route('/profile', {name: 'profile'});
Router.route('/login', {name: 'login'});