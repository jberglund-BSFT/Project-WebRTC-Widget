module( "Authentication", {
  setup: function() {
    TestWebrtc.Helpers.mockWebRTC();
    TestWebrtc.Helpers.mockSound();
    ClientConfig.domainTo = "domain.to";
    ClientConfig.domainFrom = "domain.from";
    ClientConfig.enableRegistrationIcon = true;
    WebRTC.Sound.prototype.enableLocalAudio = function(enable) {console.log("enableLocalAudio : "+enable);}
  }, teardown: function() {
    WebRTC.Utils.getSearchVariable = function(name){ return false;}
    client.settings.clear();
  }
});

test('on 403 : with settingUserId', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  TestWebrtc.Helpers.connect();
  strictEqual(client.authentication.visible, false);
  TestWebrtc.Helpers.registrationFailed(403);
  strictEqual(client.authentication.visible, true);
  strictEqual(client.authentication.userIdInput.val(), '12345');
  strictEqual(client.authentication.passwordInput.val(), '');
  client.authentication.passwordInput.val("121212");
  client.authentication.okButton.trigger("click");
  strictEqual(client.authentication.visible, false);
  strictEqual(client.sipStack.ua.configuration.uri.toString(), 'sip:12345@'+ClientConfig.domainFrom);
  strictEqual(client.sipStack.ua.configuration.authorization_user, '12345');
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '', 'should NOT set settings authenticationUserId');
  strictEqual(client.settings.password(), '', 'should NOT set settings password');
  TestWebrtc.Helpers.registered();
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '', 'should NOT set settings authenticationUserId as same as userId');
  strictEqual(client.settings.password(), '121212', 'should set settings password');
});
test('on 403 : with settingUserId and settingAuthenticationUserId', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  client.settings.authenticationUserId('54321');
  TestWebrtc.Helpers.connect();
  strictEqual(client.authentication.visible, false);
  TestWebrtc.Helpers.registrationFailed(403);
  strictEqual(client.authentication.visible, true);
  strictEqual(client.authentication.userIdInput.val(), '54321');
  strictEqual(client.authentication.passwordInput.val(), '');
  client.authentication.passwordInput.val("121212");
  client.authentication.okButton.trigger("click");
  strictEqual(client.authentication.visible, false);
  strictEqual(client.sipStack.ua.configuration.uri.toString(), 'sip:12345@'+ClientConfig.domainFrom);
  strictEqual(client.sipStack.ua.configuration.authorization_user, '54321');
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '54321', 'should NOT change settings authenticationUserId');
  strictEqual(client.settings.password(), '', 'should NOT set settings password');
  TestWebrtc.Helpers.registered();
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '54321', 'should NOT change settings authenticationUserId as same as userId');
  strictEqual(client.settings.password(), '121212', 'should set settings password');
});
test('on 403 : with settingUserId and userId changed', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  TestWebrtc.Helpers.connect();
  TestWebrtc.Helpers.registrationFailed(403);
  client.authentication.userIdInput.val("54321");
  client.authentication.passwordInput.val("121212");
  client.authentication.okButton.trigger("click");
  strictEqual(client.sipStack.ua.configuration.authorization_user, '54321');
  TestWebrtc.Helpers.registered();
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '54321', 'should set settings authenticationUserId');
  strictEqual(client.settings.password(), '121212', 'should set settings password');
});
test('on 403 : with settingUserId and settingsAuthenticationUserId and userId changed', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  client.settings.authenticationUserId('54321');
  TestWebrtc.Helpers.connect();
  TestWebrtc.Helpers.registrationFailed(403);
  client.authentication.userIdInput.val("98765");
  client.authentication.passwordInput.val("121212");
  client.authentication.okButton.trigger("click");
  strictEqual(client.sipStack.ua.configuration.authorization_user, '98765');
  TestWebrtc.Helpers.registered();
  strictEqual(client.settings.userId(), '12345', 'should NOT change settings userId');
  strictEqual(client.settings.authenticationUserId(), '98765', 'should change settings authenticationUserId');
  strictEqual(client.settings.password(), '121212', 'should set settings password');
});
test('on 403 : with settingPassword and settingUserId', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  client.settings.password('password');
  TestWebrtc.Helpers.connect();
  strictEqual(client.authentication.visible, false);
  TestWebrtc.Helpers.registrationFailed(403);
  strictEqual(client.authentication.visible, false);
});
test('on 403 : with settingAuthenticationUserId and settingPassword and settingUserId', function() {
  client = new WebRTC.Client();
  client.settings.userId('12345');
  client.settings.authenticationUserId('54321');
  client.settings.password('password');
  TestWebrtc.Helpers.connect();
  strictEqual(client.authentication.visible, false);
  TestWebrtc.Helpers.registrationFailed(403);
  strictEqual(client.authentication.visible, false);
});
test('on non 403', function() {
  $.cookie('settingUserId', '12345');
  client = new WebRTC.Client();
  TestWebrtc.Helpers.connect();
  strictEqual(client.authentication.visible, false);
  TestWebrtc.Helpers.registrationFailed(404);
  strictEqual(client.authentication.visible, false);
});