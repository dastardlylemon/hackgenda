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
        didSelectSchedule();
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

global_state = {};

var snapper;

var chatRef = new Firebase('https://hackgenda.firebaseio.com');


function save_state() {
    for (var key in global_state) {
        localStorage[key] = JSON.stringify(global_state[key]);
    }
}

function get_state() {
    for (var key in localStorage) {
        global_state[key] = JSON.parse(localStorage[key]);
    }
}

function change_view(list_el) {
    snapper.close('left');
}

function addEvent(element, eventName, func) {
    if (element.addEventListener) {
        return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

function initSlidebar() {
    snapper = new Snap({
        element: document.getElementById('content'),
        disable: 'right'
    });
    addEvent(document.getElementById('open-left'), 'click', function(){
        if (document.body.className === "snapjs-left") {
            snapper.close('left');
        } else {
            snapper.open('left');
        }
     });
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

function replace_body(url) {
    request_get(url, function (e) {
                var data = e.target.responseText;
                var body = document.body;
                body.innerHTML = data;
                });
}

function didSelectSchedule() {
    var elements = new Array();
    request_get("http://hackgenda.herokuapp.com/test/schedule.json", function(response) {
         json = JSON.parse(response.target.response);
                json.forEach(function(v, i) {
                             var dayHead = document.createElement('h3');
                             dayHead.setAttribute('class', 'topcoat-list__header');
                             dayHead.innerHTML = v.day;
                             elements.push(dayHead);
                             var dayCells = document.createElement('ul');
                             dayCells.setAttribute('class', 'topcoat-list__container');
                             v.events.forEach(function(vv, ii) {
                                                 var dayCell = document.createElement('li');
                                                 dayCell.setAttribute('class', 'topcoat-list__item');
                                                 var dayTitle = document.createElement('h2');
                                                 dayTitle.innerHTML = vv.name;
                                              var dayDesc = document.createElement('span');
                                              dayDesc.innerHTML = vv.description + " | " + vv.time;
                                              dayCell.appendChild(dayTitle);
                                              dayCell.appendChild(dayDesc);
                                              if (vv.URL) {
                                              dayCell.addEventListener('click', function() {
                                                                       var url = encodeURI(vv.URL);
                                                                       window.open(url, "_blank");
                                                                       });
                                              }
                                                 dayCells.appendChild(dayCell);
                                                 });
                             elements.push(dayCells);
                });
                var list = document.getElementById('scroller');
                list.innerHTML = "";
                elements.forEach(function(v, i) {
                                 list.appendChild(v);
                                 });
    });
        snapper.close();
}
