angular.module('freedive').config(function($stateProvider, $urlRouterProvider){
	
	// Otherwise route
	$urlRouterProvider.otherwise('menu/tables');

	// top level routes
	addTopLevelRoutes($stateProvider);

});

function addTopLevelRoutes($stateProvider){

	// Hier kommen alle Top Level Routes hin: UTabellen, Hilfsmittel, Gesetzestexte, About

	// abstract
	$stateProvider.state('menu', {
		url: '/menu',
		abstract: true,
		templateUrl: 'client/templates/sidemenu.html'
	});

	// concrete
	$stateProvider.state('menu.tables', {
		url: '/tables',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/tables.html',
				controller: 'TablesController as tables'
			}
		}
	});

	// concrete
	$stateProvider.state('menu.staticTable', {
		url: '/staticTable/:tableId',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/staticTable.html',
				controller: 'StaticTableController as table'
			}
		}
	});

	// concrete
	$stateProvider.state('menu.dynamicTable', {
		url: '/dynamicTable/:tableId',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/dynamicTable.html',
				controller: 'DynamicTableController as table'
			}
		}
	});
	
	// concrete
	$stateProvider.state('menu.hold', {
		url: '/hold',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/hold.html',
				controller: 'HoldController as hold'
			}
		}
	});
	
	// concrete
	$stateProvider.state('menu.settings', {
		url: '/settings',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/settings.html',
				controller: 'SettingsController as settings'
			}
		}
	});
	
	// concrete
	$stateProvider.state('menu.about', {
		url: '/about',
		views: {
			'menuContent': {
				templateUrl: 'client/templates/about.html',
				controller: 'AboutController as about'
			}
		}
	});
}



