sidebar_open = false;
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
        initSlidebar();
        //var ref = window.open('http://apache.org', '_blank', 'location=yes');
        //ref.addEventListener('loadstart', function() { alert(event.url); });
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

function initSlidebar() {
    var snapper = new Snap({
        element: document.getElementById('content'),
        disable: 'right'
    });

    addEvent(document.getElementById('open-left'), 'click', function(){
        if (sidebar_open) {
            snapper.close('left');
            sidebar_open = false;
            document.getElementById("open-left").style.backgroundImage = "url('img/open.png')";
        } else {
            snapper.open('left');
            sidebar_open = true;
            document.getElementById("open-left").style.backgroundImage = "url('img/close.png')";
        }
    });
}

function addEvent(element, eventName, func) {
    if (element.addEventListener) {
        return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};


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

function replace_body(url) {
    request_get(url, function (e) {
        var data = e.target.responseText;
        var body = document.body;
        body.innerHTML = data;
    });
}
