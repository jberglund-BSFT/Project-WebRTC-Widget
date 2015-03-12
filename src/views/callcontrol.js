module.exports = require('webrtc-core').bdsft.View(CallControlView)

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var PopupView = require('./popup');

function CallControlView(eventbus, callcontrol, historyView, sipstack, sound, dialpadView) {
  var self = {};

  self.model = callcontrol;
  

  self.elements = ['historyButton', 'destination', 'call', 'dialpadHolder'];

  self.init = function() {
    dialpadView.view.appendTo(self.dialpadHolder);
    PopupView(self, eventbus);
  };

  self.listeners = function() {
    self.destination.keypress(function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        callcontrol.callUri(self.destination.val());
      }
    });
    self.historyButton.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      historyView.toggle();
    });
    self.call.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      callcontrol.callUri(self.destination.val());
    });
    eventbus.on('viewChanged', function(e) {
      if (e.view === 'dialpad' && e.visible) {
        self.destination.focus();
      } else if (e.view === 'history') {
        if (e.visible) {
          self.historyButton.removeClass("active");
        } else {
          self.historyButton.addClass("active");
        }
      } else if (e.view === 'settings' && e.visible) {
        self.hide();
      }
    });
    // Prevent the backspace key from navigating back if callcontrol is shown
    $(document).bind('keydown', function(event) {
      if (self.visible) {
        var doPrevent = false;
        if (event.keyCode === 8) {
          var d = event.srcElement || event.target;
          if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' ||
              d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE' ||
              d.type.toUpperCase() === 'EMAIL')) || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
          } else {
            doPrevent = true;
            self.destination.trigger('keydown', event);
            self.destination.putCursorAtEnd();
          }
        }

        if (doPrevent) {
          event.preventDefault();
          return;
        }
      }

      var digit = String.fromCharCode(event.which);
      eventbus.digit(digit, self.destination.is(event.target));
      self.destination.putCursorAtEnd();
    });
  };

  return self;
}