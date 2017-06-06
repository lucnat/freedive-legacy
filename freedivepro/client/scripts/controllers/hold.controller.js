
angular.module('freedive').controller('HoldController', function($scope, $reactive, $interval, $ionicPopup){
	$reactive(this).attach($scope);
	var self = this;

	self.getCurrentBest = function(){
		var holds = Holds.get();
		if(holds.length == 0){
			var currentBest = null;
		} else {
			var currentBest = holds[0].duration;
			holds.forEach(hold => {
				if(hold.duration > currentBest){
					currentBest = hold.duration
				}
			});
		}
		return currentBest;
	}

	self.helpers({
		'holds': function(){
			var holds = Holds.get();
			holds = holds.sort(function(a,b){
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
			return holds;
		},
		'currentBest': function(){
			return self.getCurrentBest();
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

		var currentBest = self.getCurrentBest();

		self.promise = $interval(function(){
			self.timer = self.timer + 1;
			if(self.notifyOnCurrentBest && self.timer == currentBest){
				navigator.vibrate(300);
				console.log('VIBRATING');
			}
			if(self.notifyOn60Seconds && self.timer%60 == 0){
				navigator.vibrate(300);
				console.log('60 seconds');
			}
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


