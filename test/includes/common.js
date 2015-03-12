var jsdom = require('mocha-jsdom');
var fs = require('fs');
expect = require('expect');
ExSIP = require('exsip');

jsdom({
  src: [
    // fs.readFileSync('js/jquery-1.11.0.js', 'utf-8'), 
    // fs.readFileSync('js/jquery-cookie-1.3.1.js', 'utf-8'),
    // fs.readFileSync('js/jquery-ui-1.10.3.custom.js', 'utf-8')
  ]
});

Object.defineProperties(global, {
  connectionstatus: {
    get: function(){
      return global.bdsft_client_instances.connectionstatus_test;
    }
  },
  settings: {
    get: function(){
      return global.bdsft_client_instances.settings_test;
    }
  },
  stats: {
    get: function(){
      return global.bdsft_client_instances.stats_test;
    }
  },
  statsview: {
    get: function(){
      return global.bdsft_client_instances.statsview_test;
    }
  },
  timer: {
    get: function(){
      return global.bdsft_client_instances.timer_test;
    }
  },
  timerview: {
    get: function(){
      return global.bdsft_client_instances.timerview_test;
    }
  },
  smsprovider: {
    get: function(){
      return global.bdsft_client_instances.smsprovider_test;
    }
  },
  sms: {
    get: function(){
      return global.bdsft_client_instances.sms_test;
    }
  },
  smsview: {
    get: function(){
      return global.bdsft_client_instances.smsview_test;
    }
  },
  history: {
    get: function(){
      return global.bdsft_client_instances.history_test;
    }
  },
  historyview: {
    get: function(){
      return global.bdsft_client_instances.historyview_test;
    }
  },
  settingsview: {
    get: function(){
      return global.bdsft_client_instances.settingsview_test;
    }
  },
  reinvite: {
    get: function(){
      return global.bdsft_client_instances.reinvite_test;
    }
  },
  reinviteview: {
    get: function(){
      return global.bdsft_client_instances.reinviteview_test;
    }
  },
  sipstack: {
    get: function(){
      return global.bdsft_client_instances.sipstack_test;
    }
  },
  authentication: {
    get: function(){
      return global.bdsft_client_instances.authenticationview_test;
    }
  },
  incomingcall: {
    get: function(){
      return global.bdsft_client_instances.incomingcall_test;
    }
  },
  incomingcallview: {
    get: function(){
      return global.bdsft_client_instances.incomingcallview_test;
    }
  },
  messages: {
    get: function(){
      return global.bdsft_client_instances.messages_test;
    }
  },
  messagesview: {
    get: function(){
      return global.bdsft_client_instances.messagesview_test;
    }
  },
  configuration: {
    get: function(){
      return global.bdsft_client_instances.configuration_test;
    }
  },
  callcontrol: {
    get: function(){
      return global.bdsft_client_instances.callcontrol_test;
    }
  },
  callcontrolview: {
    get: function(){
      return global.bdsft_client_instances.callcontrolview_test;
    }
  },
  video: {
    get: function(){
      return global.bdsft_client_instances.videoview_test;
    }
  },
  dialpad: {
    get: function(){
      return global.bdsft_client_instances.dialpadview_test;
    }
  },
  transfer: {
    get: function(){
      return global.bdsft_client_instances.transfer_test;
    }
  },
  transferview: {
    get: function(){
      return global.bdsft_client_instances.transferview_test;
    }
  },
  eventbus: {
    get: function(){
      return global.bdsft_client_instances.eventbus_test;
    }
  },
  videobar: {
    get: function(){
      return global.bdsft_client_instances.videobarview_test;
    }
  }
});

localStorage = {};
var localStorageMethods = 5;
localStorage.setItem = function (key, val) {
     this[key] = val + '';
}
localStorage.getItem = function (key) {
    return this[key];
}
localStorage.key = function (index) {
    return Object.keys(this)[index + localStorageMethods];
}
localStorage.removeItem = function (key) {
  delete this[key];
};
localStorage.clear = function () {
  for(var i = this.length; i >= 0; i--) {
    var key = this.key(i);
    this.removeItem(key);
  }
}
Object.defineProperty(localStorage, 'length', {
    get: function () { 
      return Object.keys(this).length - localStorageMethods; 
    }
});

setUp = function(){
  core = require('webrtc-core');
  global.bdsft_client_instances = {};
  testUA = require('./testUA');
  Utils = core.utils;
  Constants = core.constants;
  WebRTC = require('../../src/webrtc');
  Client = require('../../src/views/client');
  Stats = require('../../src/views/stats');
  ClientConfig = require('../../js/client-config.js.default');
}

create = function(config){
  var clientConfig = Utils.clone(ClientConfig);
  var options = $.extend({id: 'test'}, clientConfig, config, {debug: false, disabled: false, enableWindowDrag: false});
  options.dependencies = [core];
  options.instancesObj = 'bdsft_client_instances';
  var client = require('../../src/factory')(options)(Client);
  client.appendTo($('body'));
  return client;
}
tearDown = function() {
  WebRTC.Utils.getSearchVariable = function(name) {
    return false;
  }
  settings.clear();
}