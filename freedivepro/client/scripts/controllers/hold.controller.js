
angular.module('freedive').controller('HoldController', function($scope, $reactive, $interval, $ionicPopup){
	$reactive(this).attach($scope);
	var self = this;

	self.helpers({
		'holds': function(){
			var holds = Holds.get();
			holds = holds.sort(function(a,b){
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
			return holds;
		}
	});

	self.timer = 0;
	self.started = false;

	self.start = function(){
		$('#start').css('display', 'none');
		$('#stop').css('display', '');
		$('.left-buttons').css('display','none');
		self.started = true;
		if (Meteor.isCordova) {
			window.plugins.insomnia.keepAwake();
		}
		self.promise = $interval(function(){
			self.timer = self.timer + 1;
		}, 1000)
	}

	self.stop = function(){
		$('#start').css('display', '');
		$('#stop').css('display', 'none');
		$('.left-buttons').css('display','');
		self.started = false;
		if (Meteor.isCordova) {
			window.plugins.insomnia.allowSleepAgain();
		}
		$interval.cancel(self.promise);
		$ionicPopup.confirm({
			title: 'Save to history?',
		}).then(function(res){
			if(res){
				Holds.insert({
					'duration': self.timer,
					createdAt: new Date()
				});
			}
			self.timer = 0;
		});

	}
});


