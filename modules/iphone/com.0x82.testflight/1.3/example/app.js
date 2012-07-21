// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'white'
});

var feedback_button = Ti.UI.createButton({
  title: 'Show feedback',
  left: 10,
  right: 10,
  top: 10,
  height: 40
});
window.add(feedback_button);

var checkpoint_button = Ti.UI.createButton({
  title: 'Mark checkpoint',
  left: 10,
  right: 10,
  top: 60,
  height: 40
});
window.add(checkpoint_button);

var manual_feedback = Ti.UI.createButton({
  title: 'Send manual feedback',
  left: 10,
  right: 10,
  top: 110,
  height: 40
});
window.add(manual_feedback);

window.open();

var testflight = require('com.0x82.testflight');
Ti.API.info("module is => " + testflight);

// WARNING: ONLY USE THIS ON DEVELOPMENT! DON'T GO TO THE APP STORE WITH THIS LINE!!
testflight.setDeviceIdenifier(Ti.Platform.id);

testflight.takeOff('817d95cf45bb95e2951df299da2339fb_NDU2NjcyMDEyLTAzLTExIDEwOjQ5OjA2LjMyNjc0NQ');
testflight.addCustomEnvironmentInformation({
  username: 'username',
  session_id: '123123123123123',
  other_example: 'other_value'
});

feedback_button.addEventListener('click', function(e) {
  Ti.API.warn("Open Feedback View");
  testflight.openFeedbackView();
});
checkpoint_button.addEventListener('click', function(e) {
  Ti.API.warn("Checkpoing");
  testflight.passCheckpoint("CHECKPOINT 1");
});
manual_feedback.addEventListener('click', function(e) {
  Ti.API.warn("Manual sending feedback");
  testflight.submitFeedback("Manual feedback text");
});

