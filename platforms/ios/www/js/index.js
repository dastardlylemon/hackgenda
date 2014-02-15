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
        //app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }*/
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
