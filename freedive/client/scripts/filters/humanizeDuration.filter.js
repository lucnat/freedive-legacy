
angular.module('freedive').filter('humanizeDuration', function(){
	return function(dateString){
		var date = new Date(dateString);
		return moment.duration(new Date() - date).humanize();
	};
});
