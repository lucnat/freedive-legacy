angular.module('freedive', ['angular-meteor','ionic']);
 
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}
 
function onReady() {
  angular.bootstrap(document, ['freedive']);
}

if (Meteor.isCordova) {
	document.addEventListener("deviceready", function() {
		StatusBar.overlaysWebView(true);
		StatusBar.styleLightContent();
	}, false);
}


notify = function(text){
	if(Meteor.isCordova){
		if(User.get().vibrate){
			navigator.vibrate(300);
		}
		if(User.get().mute){
      if(device.platform == 'iOS' && device.version[0]/1.0 >= 9){
        TTS.speak({text: text, rate: 1.6}, function() {});
      } else {
        TTS.speak(text, function() {});
      }
		}
	}
};


Meteor.startup(function () {
  if (Meteor.isCordova) {
    if (AdMob) {
      AdMob.createBanner( {
        adId: 'ca-app-pub-8972085867877753/1984936342',
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        overlap: false,
        isTesting: false,
        autoShow: true,
        success: function() {
          console.log("Received ad");
        },
        error: function() {
          console.log("No ad received");
        }
      });
    } else {
      console.log("No Admob");
    }
  }
});