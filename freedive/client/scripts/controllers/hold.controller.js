
angular.module('freedive').controller('HoldController', function($scope, $reactive, $interval, $ionicPopup){
	$reactive(this).attach($scope);
	var self = this;

	self.helpers({
		'holds': function(){
			return Holds.get();
		}
	});

	self.timer = 0;
	self.started = false;

	self.start = function(){
		$('#start').css('display', 'none');
		$('#stop').css('display', '');
		self.started = true;
		self.promise = $interval(function(){
			self.timer = self.timer + 1;
		}, 1000)
	}

	self.stop = function(){
		$('#start').css('display', '');
		$('#stop').css('display', 'none');
		self.started = false;
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


