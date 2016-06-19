
angular.module('freedive').filter('humanizeTime', function(){
	return function(seconds){
		return moment.utc(seconds*1000).format("mm:ss")
	};
});
