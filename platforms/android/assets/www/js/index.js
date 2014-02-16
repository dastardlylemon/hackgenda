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
        get_state();
        if ('registered' in global_state) {
            continue;
        } else {
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(app.successHandler, app.errorHandler, {"senderID":"351988118019", "ecb": "app.onNotificationGCM"});
        }
        //initSlidebar();
        //login_or_schedule();
        alert('ayo');
    },
    successHandler: function(result) {
        return undefined;
    },
    errorHandler: function(error) {
        return undefined;
    },

    onNotificationGCM: function(e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    alert("Regid " + e.regid);
                    //sendRequest("http://hackgenda.herokuapp.com/mobile/android", function (response) { return undefined; }, {"id": e.regid});
                    request_get("http://hackgenda.herokuapp.com/mobile/android/" + e.regid, function (response) { return undefined;});
                    get_state();
                    global_state['registered'] = true;
                    save_state();
                    alert('done');
                }
                break;
            case 'message':
                //YO DO SHIT HERE
                //RELOAD UPDATES VIEW
                break;
            case 'error':
                break;
            default:
                break;
        }
    }
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

function didSelectSchedule() {
    var elements = new Array();
    request_get("http://hackgenda.herokuapp.com/mobile/schedule", function(response) {
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

function updateView(html, callback) {
    content = document.getElementById('scroller');
    content.innerHTML = html;
    snapper.close('left');
    callback.call(this, html);
}

function getViewFromURL(url) {
    request_get(url, function (response) {
        document.getElementById('scroller').innerHTML = response.target.response;
        snapper.close('left');
    });
}

function gotologin() {
    getViewFromURL('login.html');
}

function fblogin() {
    FB.login(function(response) {
        if (response.session) {
            alert('logged in');
        } else {
            alert('not logged in');
        }
    }, {scope: "email"});
}

function sendRequest(url,callback,postData) {
    var req = createXMLHTTPObject();
    if (!req) return;
    var method = (postData) ? "POST" : "GET";
    req.open(method,url,true);
    req.setRequestHeader('User-Agent','XMLHTTP/1.0');
    if (postData) {
        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    }
    req.onreadystatechange = function () {
        if (req.readyState != 4) return;
        if (req.status != 200 && req.status != 304) {
            //alert('HTTP error ' + req.status);
            return;
        }
        callback(req);
    }
    if (req.readyState == 4) return;
    req.send(postData);
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

function twlogin() {
    sendRequest("https://api.twitter.com/oauth/request_token", function (e) { alert(e); }, {
        oauth_consumer_key : "IDFJkMbW1Ty3CzspMPcdTg",
        oauth_callback: "./logged_in.html"});
}

function login() {
    username = document.getElementById('username').value;
    get_state();
    global_state["username"] = username;
    global_state["id"] = Math.floor(Math.random()*10);
    save_state();
    didSelectSchedule();
}

function login_or_schedule(){
    get_state();
    if('username' in global_state) {
        didSelectSchedule();
    } else {
        gotologin();
    }
}

function updateUpdatesView() {
    request_get("http://hackgenda.herokuapp.com/", function(response) {
        var updates = [];
        json = JSON.parse(response.target.response);
        updates = json["updates"];
        updates.forEach(function (update) {
            var update_el = document.createElement('li');
            var name = document.createElement('h2');
            name.innerHTML = update['name'];
            update_el.appendChild(name);
            var desc = document.createElement('h3');
            desc.innerHTML = update['description'];
            update_el.appendChild(desc);
            var author = document.createElement('p');
            author.innerHTML = update['author'];
            update_el.appendChild(author);
            var time = document.createElement('p');
            time.innerHTML = update['time'];
            update_el.appendChild(time);
        });
        var updates_el = document.createElement('ul');
        updates.forEach(function(update_li) {
            updates_el.appendChild(update_li);
        });
        var list = document.getElementById('scroller');
        list.innerHTML = "";
        list.appendChild(updates_el);
    });
    snapper.close();
}
