
angular.module('freedivepro').filter('humanizeDuration', function(){
	return function(date){
		return moment.duration(new Date() - date).humanize();
	};
});
