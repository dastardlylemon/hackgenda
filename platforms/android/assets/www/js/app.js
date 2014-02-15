var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {
    if (parseFloat(window.device.version) === 7.0) {
        document.body.style.marginTop = "20px";
    }
},
    
};

var chatRef = new Firebase('https://hackgenda.firebaseio.com');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
                                   if (error) {
                                   // an error occurred while attempting login
                                   console.log(error);
                                   } else if (user) {
                                   // user authenticated with Firebase
                                   console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
                                   } else {
                                   // user is logged out
                                   }
                                   });

function fbLogin() {
    auth.login('facebook', {
               rememberMe: true,
               scope: 'email'
               });
}

function twLogin() {
    auth.login('twitter', {
               rememberMe: true
               });
}