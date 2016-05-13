
angular.module('freedive').controller('TableController', function($scope, $reactive, $stateParams, $ionicPopup){
	$reactive(this).attach($scope);
	var self = this;

	var	table = Tables.findOne($stateParams.tableId);
	var durations = table.durations;
	var rows = [];
	for(var i=0; i<durations.length; i=i+2){
		var row = [durations[i], durations[i+1]];
		rows.push(row);
	}

	self.rows = rows;
	self.table = table;
	self.started = false;
	self.totalTime = (function(){
		var total = 0;
		durations.forEach(function(duration){
			total += duration;
		});
		return total;
	})();

	self.start = function(){
		self.started = true;
		$('.back-button').css('display','none');

		if (Meteor.isCordova) {
			window.plugins.insomnia.keepAwake();
		}

		// construct array of countdowns
		var timers = $('.timer');
		self.countdowns = [];
		for(var i=0; i<durations.length; i++){
			self.countdowns.push(new Countdown(durations[i], timers[i]));
		}
		for(var i=0; i<self.countdowns.length-1; i++){
			self.countdowns[i].setNext(self.countdowns[i+1]);
		}

		self.countdowns[0].startCountdown($scope);
	};

	self.stopSession = function(){
		self.started = false;
		$('.back-button').css('display','');

		if (Meteor.isCordova) {
			window.plugins.insomnia.allowSleepAgain();
		}
		try{
			self.countdowns.forEach(function(countdown){
				countdown.reset();
			});
		} catch(e) {};
	};

	self.stop = function(){

		var anyCountdownsRunning = false;
		self.countdowns.forEach(function(countdown){
			if(countdown.isRunning){
				anyCountdownsRunning = true;
			}
		});

		if(anyCountdownsRunning){
			$ionicPopup.confirm({
				title: 'Stop this session?',
			}).then(function(res){
				if(res){
					self.stopSession();
				}
			});
		} else {
			self.stopSession();
		}
	};

});

