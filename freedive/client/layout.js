Template.layout.helpers({
	'hideTabs': function(){
		return !!Session.get('hideTabs');
	}
});

Template.layout.rendered = function(){
	if (Meteor.isCordova) {
		breatheSound = new Media(Meteor.absoluteUrl('breathe.mp3'));
		breatheSound.setVolume(0.0); breatheSound.play();
		holdSound = new Media(Meteor.absoluteUrl('hold.mp3'));
		holdSound.setVolume(0.0); holdSound.play();
		seconds10 = new Media(Meteor.absoluteUrl('10seconds.mp3'));
		seconds10.setVolume(0.0); seconds10.play();
		seconds30 = new Media(Meteor.absoluteUrl('30seconds.mp3'));
		seconds30.setVolume(0.0); seconds30.play();

		console.log('------------------- Audio files loaded --------------------');
	}
	else{
		breatheSound 	= new Audio('breathe.mp3');
		holdSound 		= new Audio('hold.mp3');
		seconds10 		= new Audio('10seconds.mp3');
		seconds30 		= new Audio('30seconds.mp3');
	}

	playSound = function(string){
		if(!Meteor.user().profile.muted){
			var volume = Meteor.user().profile.volume;
			try{
				if(string == 'breathe'){
					breatheSound.play();
					breatheSound.setVolume(volume/300);
				} else if(string == 'hold'){
					holdSound.play();
					holdSound.setVolume(volume/300);
				} else if(string == '10seconds'){
					seconds10.play();
					seconds10.setVolume(volume/300);
				} else if(string == '30seconds'){
					seconds30.play();
					seconds30.setVolume(volume/300);
				}
			} catch(e){}
		}

		if(Meteor.user().profile.vibrate){
			if(Meteor.isCordova){
				if(string == '10seconds' ){
					navigator.notification.vibrate(100);
				} else {
					navigator.notification.vibrate(800);
				}
			}
		}
	}
}

