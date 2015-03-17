require('./includes/common');
describe('client', function() {

  beforeEach(function() {
    setUp();
    testUA.mockWebRTC();
    config = {};
    config.domainTo = "domain.to";
    config.domainFrom = "domain.from";
    config.enableMute = true;
    config.enableTransfer = true;
    config.enableCallStats = false;
    config.enableCallControl = true;
    config.enableHD = true;
  });

  it('validateDestination', function() {
    client = create(config);
    configuration.allowOutside = true;
    expect(callcontrol.validateDestination("1000")).toEqual("sip:1000@domain.to");
    expect(callcontrol.validateDestination("1000@webrtc")).toEqual("sip:1000@webrtc.domain.to");
    expect(callcontrol.validateDestination("1000@webrtc.domain.to")).toEqual("sip:1000@webrtc.domain.to");
    expect(callcontrol.validateDestination("1000@domain.to")).toEqual("sip:1000@domain.to");
  });
  it('validateDestination with allowOutside = false', function() {
    client = create(config);
    configuration.allowOutside = false;
    expect(callcontrol.validateDestination("1000")).toEqual(false);
    expect(callcontrol.validateDestination("1000@webrtc")).toEqual(false);
    expect(callcontrol.validateDestination("1000@webrtc.domain.to")).toEqual("sip:1000@webrtc.domain.to");
    expect(callcontrol.validateDestination("1000@domain.to")).toEqual("sip:1000@domain.to");
    expect(callcontrol.validateDestination("1000@anotherdomain.to")).toEqual(false);
  });
  it('resolution class for hd=true', function() {
    WebRTC.Utils.getSearchVariable = function(name) {
      return name === "hd" ? "true" : false;
    }
    client = create(config);
    expect(client.client.attr('class').split(" ")[1]).toEqual("r" + WebRTC.C.R_1280x720);
  });
  it('resolution class for resolution setting', function() {
    config.displayResolution = '';
    config.encodingResolution = '';
    WebRTC.Utils.getSearchVariable = function(name) {
      return name === "hd" ? "false" : false;
    }
    $.cookie("settingsResolutionDisplay", WebRTC.C.R_960x720);
    $.cookie("settingsResolutionEncoding", WebRTC.C.R_320x240);
    client = create(config);
    expect(configuration.displayResolution).toEqual(WebRTC.C.R_960x720);
    expect(client.client.attr('class').split(" ")[1]).toEqual("r" + WebRTC.C.R_960x720);
  });
  it('destination configuration and enableConnectLocalMedia = false', function() {
    var destinationCalled = '';
    config.destination = '12345';
    config.enableConnectLocalMedia = false;
    client = create(config);
    callcontrol.callUri = function(destination) {
      destinationCalled = destination;
    };
    testUA.connectAndStartCall();
    sipstack.ua.isConnected = function() {
      return true;
    };
    expect(destinationCalled).toEqual('12345');
    testUA.endCall();

    // trigger connect again to verify destination is only called once
    destinationCalled = '';
    testUA.connect();
    expect(destinationCalled).toEqual('');
    delete config.destination;
    config.enableConnectLocalMedia = true;
  });
  it('destination configuration and enableConnectLocalMedia = true', function() {
    var destinationCalled = '';
    config.destination = '12345';
    config.enableConnectLocalMedia = true;
    client = create(config);
    callcontrol.callUri = function(destination) {
      destinationCalled = destination;
    };
    testUA.connectAndStartCall();
    sipstack.ua.isConnected = function() {
      return true;
    };
    expect(destinationCalled).toEqual('12345');
    testUA.endCall();

    // trigger connect again to verify destination is only called once
    destinationCalled = '';
    testUA.connect();
    expect(destinationCalled).toEqual('');
    delete config.destination;
  });
  it('muteAudio', function() {
    client = create(config);
    testUA.isVisible(videobar.muteAudioIcon, false);
  });
  it('unmuteAudio', function() {
    client = create(config);
    testUA.isVisible(videobar.unmuteAudioIcon, false);
  });
  it('hangup', function() {
    client = create(config);
    testUA.isVisible(videobar.hangup, false);
  });
  it('muteAudio on call started', function() {
    client = create(config);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.muteAudioIcon, true);
  });
  it('muteAudio on mute triggered', function() {
    client = create(config);
    testUA.connectAndStartCall();
    videobar.muteAudioIcon.trigger("click");
    testUA.isVisible(videobar.muteAudioIcon, false);
    testUA.isVisible(videobar.unmuteAudioIcon, true);
    videobar.unmuteAudioIcon.trigger("click");
    testUA.isVisible(videobar.unmuteAudioIcon, false);
    testUA.isVisible(videobar.muteAudioIcon, true);
  });
  it('fullScreen icon', function() {
    config.enableFullScreen = true;
    client = create(config);
    testUA.isVisible(videobar.fullScreenExpand, true);
    testUA.isVisible(videobar.fullScreenContract, false);
  });
  it('fullScreen icon with enableFullScreen = false', function() {
    config.enableFullScreen = false;
    client = create(config);
    testUA.isVisible(videobar.fullScreenExpand, false);
    testUA.isVisible(videobar.fullScreenContract, false);
  });
  it('fullScreen icon after click', function() {
    config.enableFullScreen = true;
    client = create(config);
    videobar.fullScreenExpand.trigger('click');
    testUA.isVisible(videobar.fullScreenExpand, false);
    testUA.isVisible(videobar.fullScreenContract, true);
    videobar.fullScreenContract.trigger('click');
    testUA.isVisible(videobar.fullScreenExpand, true);
    testUA.isVisible(videobar.fullScreenContract, false);
  });
  it('selfView icon', function() {
    config.enableSelfView = true;
    client = create(config);
    testUA.isVisible(videobar.selfViewEnable, false);
    testUA.isVisible(videobar.selfViewDisable, true);
    testUA.isVisible(video.localVideo, true);
  });
  it('selfView icon with enableSelfView = false', function() {
    config.enableSelfView = false;
    client = create(config);
    testUA.isVisible(videobar.selfViewEnable, false);
    testUA.isVisible(videobar.selfViewDisable, false);
    testUA.isVisible(video.localVideo, false);
  });
  it('selfView icon after click', function() {
    config.enableSelfView = true;
    client = create(config);
    videobar.selfViewDisable.trigger('click');
    testUA.isVisible(videobar.selfViewEnable, true);
    testUA.isVisible(videobar.selfViewDisable, false);
    testUA.isVisible(video.localVideo, false);
    videobar.selfViewEnable.trigger('click');
    testUA.isVisible(videobar.selfViewEnable, false);
    testUA.isVisible(videobar.selfViewDisable, true);
    testUA.isVisible(video.localVideo, true);
  });
  it('dialpad icon', function() {
    config.enableDialpad = true;
    client = create(config);
    testUA.isVisible(videobar.dialpadIconShow, true);
    testUA.isVisible(videobar.dialpadIconHide, false);
    expect(callcontrolview.visible).toEqual(false);
  });
  it('dialpad icon with enableDialpad = false', function() {
    config.enableDialpad = false;
    client = create(config);
    testUA.isVisible(videobar.dialpadIconShow, false);
    testUA.isVisible(videobar.dialpadIconHide, false);
    expect(callcontrolview.visible).toEqual(false);
  });
  it('dialpad icon after click', function() {
    config.enableDialpad = true;
    client = create(config);
    videobar.dialpadIconShow.trigger('click');
    testUA.isVisible(videobar.dialpadIconShow, false);
    testUA.isVisible(videobar.dialpadIconHide, true);
    expect(callcontrolview.visible).toEqual(true);
    videobar.dialpadIconHide.trigger('click');
    testUA.isVisible(videobar.dialpadIconShow, true);
    testUA.isVisible(videobar.dialpadIconHide, false);
    expect(callcontrolview.visible).toEqual(false);
  });
  it('dialpad icon after click and in call', function() {
    config.enableDialpad = true;
    client = create(config);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.hangup, true);
    videobar.dialpadIconShow.trigger('click');
    testUA.isVisible(videobar.hangup, true);
    videobar.dialpadIconHide.trigger('click');
    testUA.isVisible(videobar.hangup, true);
  });
  it('hangup on call started', function() {
    client = create(config);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.hangup, true);
  });
  it('muteAudio on call started and disabled muted', function() {
    config.enableMute = false;
    client = create(config);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.muteAudioIcon, false);
  });
  it('unmuteAudio on call started and disabled muted', function() {
    config.enableMute = false;
    client = create(config);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.unmuteAudioIcon, false);
  });
  it('muteAudio on call ended', function() {
    client = create(config);
    testUA.connectAndStartCall();
    testUA.endCall();
    testUA.isVisible(videobar.muteAudioIcon, false);
  });
  it('unmuteAudio on call ended', function() {
    client = create(config);
    testUA.isVisible(videobar.muteAudioIcon, false);
    testUA.isVisible(videobar.unmuteAudioIcon, false);
    testUA.connectAndStartCall();
    testUA.isVisible(videobar.muteAudioIcon, true);
    testUA.isVisible(videobar.unmuteAudioIcon, false);
    videobar.muteAudioIcon.trigger("click");
    testUA.isVisible(videobar.unmuteAudioIcon, true);
    testUA.isVisible(videobar.muteAudioIcon, false);
    testUA.endCall();
    expect(sipstack.getCallState()).toEqual("connected");
    testUA.isVisible(videobar.muteAudioIcon, false);
    testUA.isVisible(videobar.unmuteAudioIcon, false);
  });
  it('hangup on call ended', function() {
    client = create(config);
    testUA.connectAndStartCall();
    testUA.endCall();
    testUA.isVisible(videobar.hangup, false);
  });
  it('hangup on calling', function() {
    client = create(config);
    sipstack.ua.isConnected = function() {
      return true;
    }
    callcontrolview.show();
    callcontrol.callUri("1000@webrtc.domain.to");
    testUA.newCall();
    expect(sipstack.getCallState()).toEqual("calling");
    testUA.isVisible(videobar.hangup, true);
    expect(callcontrolview.call.css('opacity')).toEqual("0");
  });
  it('hangup on failed', function() {
    client = create(config);
    sipstack.ua.isConnected = function() {
      return true;
    }
    callcontrolview.show();
    testUA.failCall();
    expect(sipstack.getCallState()).toEqual("connected");
    testUA.isVisible(videobar.hangup, false);
    expect(callcontrolview.call.css('opacity')).toEqual("1");
  });
  it('getUserMedia failed', function() {
    var alertCalled = false;
    client = create(config);
    client.showErrorPopup = function() {
      alertCalled = true;
    }
    eventbus.on("calling", function(e) {
      e.session.failed('local', null, ExSIP.C.causes.USER_DENIED_MEDIA_ACCESS);
    });
    testUA.connect();
    callcontrol.callUri("1000@webrtc.domain.to");
    expect(alertCalled).toEqual(true);
  });
});