Template.atForm.events({
	'click #at-signUp': function(){
		setTimeout(function(){
			$('.input-label').remove();
		},5);
	}
});

Template.atForm.rendered = function(){
	$('#at-btn').removeClass('button-positive');
	$('#at-btn').addClass('button-dark');
	if (Meteor.isCordova) {
		if (AdMob) {
			AdMob.hideBanner()
		}
	}
}
