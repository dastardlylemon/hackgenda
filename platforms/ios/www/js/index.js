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

function goToSlidebarPage() {
    var newDiv = document.createElement("div");
    var html = " <div class='snap-drawers'> <div class='snap-drawer snap-drawer-left'>LEFT</div> <div id='content' class='snap-content'>MAIN</div> </div> ";
    newDiv.innerHTML = html;
    var oldDiv = document.getElementById("main_page");
    oldDiv.parentNode.replaceChild(newDiv, oldDiv);
    var snapper = new Snap({
        element: document.getElementById('content')
    });
}

function newPage(html) {
    document.open();
    document.write(html);
    document.close();
}

function request_get(url, callback) {
    var httpRequest;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 8 and older
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                callback.apply(this, Array.prototype.slice.call(arguments));
            }
        }
    };
    httpRequest.open('GET', url, true);
    httpRequest.send(null);
}
