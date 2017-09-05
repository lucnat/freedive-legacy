
DynamicCountdown = class{

	constructor(durationSeconds, element, next, progressbar, sister){
		this.initialDuration = durationSeconds*1000;
		this.duration = durationSeconds*1000;
		this.isRunning = false;
		this.isPaused = false;
		this.element = element;
		this.progressbar = progressbar;
		this.sister = sister;
		this.next = next;
		this.notificationMarks = User.get().notificationMarks;
		this.breathePressed = false;
	}

	startCountdown(){
		var that = this;
		that.isRunning = true;
		console.log('start countdown ');
		// means it is a breath countdown
		// $(this.element).css('background-color', 'rgb(153, 230, 153)');
		notify('hold your breath');
		that.id = Meteor.setInterval(function(){
			that.isRunning = true;
			if(that.isPaused) return;
			that.duration = that.duration - 1000;
			if(!that.breathePressed){
				// if breathe has been pressed, then do not update left counter and progress bar
				$(that.sister).html(moment.utc(that.initialDuration - that.duration).format("mm:ss"));
				var percentage = (that.initialDuration - that.duration)/that.initialDuration*100;
				$(that.progressbar).css('width', percentage+'%');
			}
			$(that.element).html(moment.utc(that.duration).format("mm:ss"));
			if(that.notificationMarks.indexOf(that.duration/1000) > -1){
				if(that.duration >= 10000){
					notify(that.duration/1000 + 'seconds');
				} else {
					notify('' + that.duration/1000);
				}
			}

			if(that.duration <= 0){
				that.stopCountdown();
				if(!!that.next){
					that.next.startCountdown();
				} else {
					// finished
					finished();
				}
			}
		}, 1000);
	}

	reset(){
		this.duration = this.initialDuration;
		$(this.element).html(moment.utc(this.duration).format("mm:ss"));
		$(this.element).css('background-color', '');
		Meteor.clearInterval(this.id);
	}

	stopCountdown(){
		$(this.element).css('background-color', '');
		$(this.progressbar).css('background-color', '#444')
		Meteor.clearInterval(this.id);
		this.isRunning = false;
	}

	togglePauseCountdown(){
		this.isPaused = !this.isPaused;
	}

	pressBreathe() {
		this.breathePressed = true;
		$(this.progressbar).css('background-color', '#444')
	}

	setNext(next){
		this.next = next;
	}

}

function finished(){
	//IonPopup.alert({'title': 'Congratulations! Session finished!'});
	notify('Session finished');
	if (Meteor.isCordova) {
		window.plugins.insomnia.allowSleepAgain();
	}

	// try to save to history
	try {
		var tableName = $($('.title-center')[0]).html();
		console.log(tableName);
		TablesHistory.insert({
			'tableName': tableName,
			'createdAt': new Date()
		});
	} catch(e) {}

	// try to click stop
	try {
		$('#stopSession').click();
	} catch(e) {};
	alert('Session finished.');
}

