/**
 * @fileoverview Utils
 */

(function(WebRTC) {
  var Sound;
//    LOG_PREFIX = WebRTC.name +' | '+ 'Configuration' +' | ';

  Sound = function() {
    this.soundOut = document.createElement("audio");
    this.soundOut.volume = ClientConfig.volumeClick;
    this.soundOutDTMF = document.createElement("audio");
    this.soundOutDTMF.volume = ClientConfig.volumeDTMF;
  };

  Sound.prototype = {
    pause: function(){
      this.soundOut.pause();
    },

    playDtmfRingback: function(){
      this.playDtmf("media/dtmf-ringback.ogg");
    },

    playRingtone: function(){
      this.play("media/ringtone.ogg");
    },

    playDtmfTone: function(tone){
      this.playDtmf("media/dtmf-" + tone + ".ogg");
    },

    playClick: function(){
      this.play("media/click.ogg");
    },

    play: function(media){
      this.soundOut.setAttribute("src", media);
      this.soundOut.play();
    },

    playDtmf: function(media){
      this.soundOutDTMF.setAttribute("src", media);
      this.soundOutDTMF.play();
    }
  };

  WebRTC.Sound = Sound;
}(WebRTC));
