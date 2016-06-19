
Countdown = class{

	constructor(durationSeconds, element, next){
		this.initialDuration = durationSeconds*1000;
		this.duration = durationSeconds*1000;
		this.isRunning = false;
		this.element = element;
		this.next = next;
		this.notificationMarks = User.get().notificationMarks;
	}

	startCountdown(){
		console.log('start countdown ');
		if($(this.element).hasClass('breathe')){
			// means it is a breath countdown
			$(this.element).css('background-color', 'rgb(153, 230, 153)');
			notify('breathe');
		} else {
			// means it is a hold countdown
			$(this.element).css('background-color', 'rgb(255, 148, 148)');
			notify('hold your breath');
		}
		var that = this;
		that.id = Meteor.setInterval(function(){
			that.isRunning = true;
			that.duration = that.duration - 1000;
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
		Meteor.clearInterval(this.id);
		this.isRunning = false;
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
	try{
		$('#stopSession').click();
	} catch(e) {};
	alert('Session finished.');
}

