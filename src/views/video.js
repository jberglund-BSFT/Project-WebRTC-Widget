module.exports = VideoView;
require('jquery-ui/draggable');

function VideoView(options, sipstack, eventbus, debug, settings, configuration, historyView) {
  var self = {}; 
  self.elements = ['local', 'remote', 'localVideo'];

  var validateUserMediaResolution = function() {
    var encodingWidth = settings.getResolutionEncodingWidth();
    var encodingHeight = settings.getResolutionEncodingHeight();
    var videoWidth = self.localWidth();
    var videoHeight = self.localHeight();
    debug("validating video resolution " + videoWidth + "," + videoHeight + " to match selected encoding " + encodingWidth + "," + encodingHeight);
    if (!videoWidth && !videoHeight) {
      return;
    }

    if (encodingWidth !== videoWidth || encodingHeight !== videoHeight) {
      var msg = "Video resolution " + videoWidth + "," + videoHeight + " does not match selected encoding " + encodingWidth + "," + encodingHeight;
      debug(msg);
    }
  };

  self.init = function() {
    // Allow some windows to be draggable, required jQuery.UI
    if (configuration.enableWindowDrag) {
      $(function() {
        self.localVideo.draggable({
          snap: ".remoteVideo,.videoBar",
          containment: ".main",
          snapTolerance: 200,
          stop: function(event, ui) {
            self.settings.updateViewPositions();
          }
        });
      });
    }
  };

  self.listeners = function() {
    self.view.bind("click", function(e) {
      historyView.hide();
    });
    self.local.bind("playing", function() {
      validateUserMediaResolution();
    });
    eventbus.on("userMediaUpdated", function(e) {
      self.updateStreams([e && e.localStream], []);
    });
    eventbus.on("resumed", function(e) {
      self.updateSessionStreams(e.sender);
    });
    eventbus.on("started", function(e) {
      self.updateSessionStreams(e.sender);
    });
  };

  self.updateSessionStreams = function() {
    self.updateStreams(sipstack.getLocalStreams(), sipstack.getRemoteStreams());
  };

  self.updateStreams = function(localStreams, remoteStreams) {
    debug("updating video streams");
    self.setVideoStream(self.local[0], localStreams);
    self.setVideoStream(self.remote[0], remoteStreams);
  };

  self.localWidth = function() {
    return self.local[0].videoWidth;
  };

  self.localHeight = function() {
    return self.local[0].videoHeight;
  };

  self.setVideoStream = function(video, streams) {
    var hasStream = streams && streams.length > 0 && typeof(streams[0]) !== 'undefined' && !streams[0].ended;
    if (video && video.mozSrcObject !== undefined) {
      if (hasStream) {
        video.mozSrcObject = streams[0];
        video.play();
      } else {
        video.mozSrcObject = null;
      }
    } else if (video) {
      if (hasStream) {
        video.src = (window.URL && window.URL.createObjectURL(streams[0])) || streams[0];
      } else {
        video.src = "";
      }
    }
  };

  return self;
}