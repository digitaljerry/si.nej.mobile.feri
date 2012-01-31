
// Declaring variables to prevent implied global error in jslint
var Ti, Drupal;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#414444');

Ti.include(
	// Codestrong libraries
	'app/feri.js',
	'app/ui.js',
	'app/datetime.js',
	
	// Drupal connection libraries
  	'drupal/drupal.js',
  	'drupal/db.js',
  	'drupal/db.insert.js',
  	'drupal/entity.js',
  	'drupal/entity.datastore.js',
  	
  	// Codestrong specific Drupal entities
  	'app/entity.js'
);

// Register our database information.
Drupal.db.addConnectionInfo('main');
Ti.Database.install('main.sql', 'main');

// If we haven't created the tables yet, make empty ones to ensure that the
// app doesn't crash.
if (!Drupal.db.getConnection('main').tableExists('node')) {
  	Drupal.entity.db('main', 'node').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('user')) {
  	Drupal.entity.db('main', 'user').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('node_cat')) {
  	Drupal.entity.db('main', 'node_cat').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('board_parents')) {
  	Drupal.entity.db('main', 'board_parents').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('board_children')) {
  	Drupal.entity.db('main', 'board_children').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('board_notifications')) {
  	Drupal.entity.db('main', 'board_notifications').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('people')) {
  	Drupal.entity.db('main', 'people').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('degrees')) {
  	Drupal.entity.db('main', 'degrees').initializeSchema();
}

Ti.include(
	// All Codestrong windows
  	'windows/ModalActivityIndicatorWindow.js',
  	'windows/BoardCatWindow.js',
  	'windows/BoardCatDetailWindow.js',
  	'windows/BoardWindow.js',
  	'windows/MapWindow.js',
  	'windows/AboutWindow.js',
  	'windows/PeopleWindow.js',
  	'windows/BoardDetailWindow.js',
  	'windows/PeopleDetailWindow.js',
  	'windows/InformacijeWindow.js',
  	'windows/UrnikiWindow.js',
  	'windows/DiplomeWindow.js',
  	'windows/DiplomeDetailWindow.js',
  	'windows/HtmlWindow.js',
  
  	// Create icons based on previous custom windows and
  	// load them into the main dashboard window
  	'app/icons.js',
  	'windows/main.js'
);

// open (sponsor) URLs in the native browser, not a webview
Ti.App.addEventListener('openURL', function(e){
  	Ti.Platform.openURL(e.url);
});
