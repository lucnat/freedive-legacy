
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
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        overlap: true,
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
  } else {
    console.log("No Cordova ");
  }
});

Template.registerHelper('hideTabs', function(){
    return Session.get('hideTabs');
});

Accounts.onLogin(function(){

  var defaultTables = [
    {
      'name': 'CO2 Tolerance',
      'description': 'auto-generated',
      '_id': new Meteor.Collection.ObjectID()._str,
      'table': CO2table(),
    },
    {
      'name': 'O2 Deprivation',
      'description': 'auto-generated',
      '_id': new Meteor.Collection.ObjectID()._str,
      'table': O2table(),
    }
  ];

  if(!Meteor.user().profile){
    // first login we set default profile
    Meteor.users.update({'_id': Meteor.user()._id}, {$set: { profile: {
      maxTime: 9, 
      CO2Mode: true,
      volume: 0.5,
      muted: false,
      vibrate: false,
      firstLogin: true,
      tables: defaultTables
    }}});
  }

  if(!Meteor.user().profile.tables){
    // if account created before update then profile exists but not default tables so let's insert. 
    Meteor.users.update({'_id': Meteor.user()._id}, {$set: {'profile.tables': defaultTables }});
  }
  Router.go('/profile');
});
