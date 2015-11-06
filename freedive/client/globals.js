
if (Meteor.isCordova) {
  document.addEventListener("deviceready", function() {
    StatusBar.overlaysWebView(true);
    StatusBar.styleLightContent();
  }, false);
}

Meteor.startup(function () {
  Session.set('hideTabs',false);
  if (Meteor.isCordova) {
    if (AdMob) {
      AdMob.createBanner( {
        adId: 'ca-app-pub-8972085867877753/1984936342',
        position: AdMob.AD_POSITION.POS_XY,
        y: window.innerHeight-99,
        x: 0,
        overlap: true,
        isTesting: false,
        autoShow: false,
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
  } else {
    console.log("No Cordova ");
  }
});


Accounts.onLogin(function(){
  if(!Meteor.user().profile){
    // first login we set default profile
    Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: {
      maxTime: 9, 
      CO2Mode: true,
      volume: 0.5,
      muted: false,
      vibrate: false,
      firstLogin: true,
    }}});
  }
  resetTable();
  Router.go('/profile');
});
