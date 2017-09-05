
angular.module('freedive').controller('DynamicTableController', function($scope, $reactive, $stateParams, $ionicPlatform, $ionicPopup, $ionicHistory){
	$reactive(this).attach($scope);
	var self = this;

	var	table = Tables.findOne($stateParams.tableId);
	var durations = table.durations;
	var rows = [];
	for(var i=0; i<durations.length; i++){
		var row = [durations[i]];
		rows.push(row);
	}

	self.rows = rows;
	self.table = table;
	self.started = false;
	self.paused = false;
	self.totalTime = (function(){
		var total = 0;
		durations.forEach(function(duration){
			total += duration;
		});
		return total;
	})();

	self.preventGoingBack = function() {
		// disables back button, and android hardware back button. Swipe back was disabled for this view statically.
		$('.back-button').css('display','none');

		$ionicPlatform.registerBackButtonAction(function (event) {
		    event.preventDefault();
		}, 100);
	}

	self.undoPreventGoingBack = function() {
		// undo disable going back
		$('.back-button').css('display','');

		$ionicPlatform.registerBackButtonAction(function (event) {
		    $ionicHistory.goBack();
		}, 100);
	}

	self.start = function(){
		self.started = true;
		self.preventGoingBack();

		if (Meteor.isCordova) {
			window.plugins.insomnia.keepAwake();
		}

		// construct array of countdowns
		var timers = $('.timer');
		var progressbars = $('.progressbar');
		$('.progressbar').css('width', '0%');
		$('.progressbar').css('background-color', '#aaa');
		var sisters = $('.sister');
		$('.sister').html(moment.utc(0).format("mm:ss"));
		self.countdowns = [];
		for(var i=0; i<durations.length; i++){
			self.countdowns.push(new DynamicCountdown(durations[i], timers[i], null, progressbars[i], sisters[i]));
		}
		for(var i=0; i<self.countdowns.length-1; i++){
			self.countdowns[i].setNext(self.countdowns[i+1]);
		}

		self.countdowns[0].startCountdown();
	};

	self.togglePause = function(){
		self.paused = !self.paused;
		console.log('paused: ' + self.paused);
		self.countdowns.forEach(function(countdown){
			if(countdown.isRunning){
				countdown.togglePauseCountdown();
			}
		});
	};

	self.breathe = function() {
		console.log('breathe');
		self.countdowns.forEach(function(countdown){
			if(countdown.isRunning) {
				countdown.pressBreathe();
			}
		});
	}

	self.stopSession = function(){
		self.started = false;
		self.undoPreventGoingBack();

		if (Meteor.isCordova) {
			window.plugins.insomnia.allowSleepAgain();
		}
		try{
			self.countdowns.forEach(function(countdown){
				countdown.reset();
			});
		} catch(e) {};
		$('.progressbar').css('background-color', '#444')
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

