Template.hold.helpers({
	'timer': function(){
		var duration = moment.duration(Session.get('timer'));
		var minutes = ('0' + duration.minutes()).slice(-2);
		var seconds = ('0' + duration.seconds()).slice(-2);
		var timerString = minutes + ':' + seconds;
		return timerString;
	}
});

Template.hold.rendered = function(){
	Session.set('timer', 0);
}

Template.hold.events({
	'click #start': function(){
		var id = Meteor.setInterval(function(){
			Session.set('timer', Session.get('timer') + 1000);
		}, 1000);
		Session.set('timerId', id);
		$('#start').css('display', 'none');
		$('#stop').css('display', '');
		$('.hidden').css('visibility', 'hidden');
		Session.set('hideTabs', true);
		if (Meteor.isCordova) {
			window.plugins.insomnia.keepAwake();
		}
	},
	'click #stop': function(){
		Meteor.clearInterval(Session.get('timerId'));

        IonPopup.confirm({
            title: 'Safe?',
            template: 'Would you like to safe it to history?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: function() {
            	var session = {
            		'createdAt': new Date(), 
            		'duration': Session.get('timer')
            	};
				var history = Meteor.user().profile.history;
				if(history){
					history.push(session);
				} else {
					history = [session]
				}
				Users.update({_id: Meteor.userId()},{$set: {'profile.history': history}});
				Session.set('timer', 0);
            },
            onCancel: function() {
            	Session.set('timer', 0);
            }
        });
       	$('#start').css('display', '');
		$('#stop').css('display', 'none');
		Session.set('hideTabs', false);
		$('.hidden').css('visibility', '');
		if (Meteor.isCordova) {
			window.plugins.insomnia.allowSleepAgain();
		}
	}
});

Template.history.helpers({
	'history': function(){
		var history = Meteor.user().profile.history.reverse();
		history.forEach(function(session){
			session.humanizedDate = moment(session.createdAt).calendar();
			var duration = moment.duration(session.duration);
			var minutes = ('0' + duration.minutes()).slice(-2);
			var seconds = ('0' + duration.seconds()).slice(-2);
			var timerString = minutes + ':' + seconds;
			session.humanizedDuration = timerString;
		});
		return history;
	}
});