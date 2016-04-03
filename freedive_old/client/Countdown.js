

Countdown = class{

	constructor(durationSeconds, element, next){
		this.initialDuration = durationSeconds*1000;
		this.duration = durationSeconds*1000;
		this.element = element;
		this.next = next;
	}

	startCountdown(){
		if($(this.element).hasClass('breathe')){
			// means it is a breath countdown
			$(this.element).css('background-color', 'rgb(153, 230, 153)');
			playSound('breathe');
		} else {
			// means it is a hold countdown
			$(this.element).css('background-color', 'rgb(255, 148, 148)');
			playSound('hold');
		}
		var that = this;
		that.id = Meteor.setInterval(function(){
			that.duration = that.duration - 1000;
			$(that.element).html(moment.utc(that.duration).format("mm:ss"));
			if(that.duration == 30000){
				playSound('30seconds');
			} else if(that.duration == 10000){
				playSound('10seconds');
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
	}

	setNext(next){
		this.next = next;
	}

}

function finished(){
	IonPopup.alert({'title': 'Congratulations! Session finished!'});
	Session.set('started', false);
	Session.set('hideTabs',false);
	playSound('finished');
	if (Meteor.isCordova) {
		window.plugins.insomnia.allowSleepAgain();
	}
	try{
		countdowns.forEach(function(countdown){
			countdown.reset();
		});
	} catch(e) {};
}