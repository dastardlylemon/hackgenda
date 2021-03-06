global_state = {
    "sidebar_open": false,
    "update": [],
    "schedule": []
}

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

var spinner;

var app = {
    // Application Constructor
initialize: function () {
    this.bindEvents();
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function () {
    get_state();
    if (!('registered' in global_state)) {
        var a = 5;
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.successHandler, app.errorHandler, {"senderID":"351988118019", "ecb": "app.onNotificationGCM"});
    }
    initSlidebar();
    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('content');
    spinner = new Spinner(opts).spin(target);
    login_or_schedule();
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
                    //alert("Regid " + e.regid);
                    //sendRequest("http://hackgenda.herokuapp.com/mobile/android", function (response) { return undefined; }, {"id": e.regid});
                    request_get("http://hackgenda.herokuapp.com/mobile/android/" + e.regid, function (response) { return undefined;});
                    get_state();
                    global_state['registered'] = true;
                    save_state();
                    alert('You will now recieve notifications from us.');
                    login_or_schedule();
                }
                break;
            case 'message':
                login_or_schedule();
                //document.getElementById('debug').innerHTML = 'message = ' + e.message + ' msgcnt = ' + e.msgcnt);
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

function addEvent(element, eventName, func) {
    if (element.addEventListener) {
        return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

var snapper, sidebar_open;

function initSlidebar() {
    snapper = new Snap({
                       element: document.getElementById('content'),
                       disable: 'right'
                       });
    
           addEvent(document.getElementById('open-left'), 'click', function () {
             if (sidebar_open) {
             snapper.close('left');
             sidebar_open = false;
             } else {
             snapper.open('left');
             sidebar_open = true;
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
            if (httpRequest.status === 200 || httpRequest.status === 0) {
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

function renderSchedule(json) {
    spinner.spin();
    var elements = new Array();
    json.forEach(function (v, i) {
                 var dayHead = document.createElement('h3');
                 dayHead.setAttribute('class', 'topcoat-list__header');
                 dayHead.innerHTML = v.day;
                 elements.push(dayHead);
                 var dayCells = document.createElement('ul');
                 dayCells.setAttribute('class', 'topcoat-list__container');
                 v.events.forEach(function (vv, ii) {
                                  var dayCell = document.createElement('li');
                                  dayCell.setAttribute('class', 'topcoat-list__item');
                                  var dayTitle = document.createElement('h2');
                                  dayTitle.innerHTML = vv.name;
                                  var dayDesc = document.createElement('span');
                                  dayDesc.innerHTML = vv.description + " | " + vv.time;
                                  dayCell.appendChild(dayTitle);
                                  dayCell.appendChild(dayDesc);
                                  if (vv.URL) {
                                  dayCell.addEventListener('click', function () {
                                                           var url = encodeURI(vv.URL);
                                                           window.open(url, "_blank");
                                                           });
                                  }
                                  dayCells.appendChild(dayCell);
                                  });
                 elements.push(dayCells);
                 });
    spinner.stop();
    var list = document.getElementById('scroller');
    list.innerHTML = "";
    elements.forEach(function (v, i) {
                     list.appendChild(v);
                     });
    var h = document.getElementById('scroller').scrollHeight * (1/3);
    document.getElementById('wrapper').setAttribute("style","height:"+h+"px");
    myScroll = new IScroll('#wrapper');
    save_state();
}

function didSelectSchedule() {
    get_state();
    if (global_state.schedule.length > 0) {
        renderSchedule(global_state.schedule);
    }
    request_get("http://hackgenda.herokuapp.com/test/schedule.json", function (response) {
                var json = JSON.parse(response.target.response);
                renderSchedule(json);
                });
    snapper.close();
}

function getViewFromURL(url) {
    request_get(url, function (res) {
                document.getElementById('scroller').innerHTML = res.target.response;
                snapper.close('left');
                });
}

function login() {
    username = document.getElementById('username').value;
    get_state();
    global_state["username"] = username;
    global_state["id"] = Math.floor(Math.random()*10);
    save_state();
    didSelectSchedule();
}

function gotologin() {
    spinner.stop();
    getViewFromURL('login.html');
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
    request_get("http://hackgenda.herokuapp.com/test/updates.json", function(response) {
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
