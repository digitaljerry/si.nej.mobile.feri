// Declaring variables to prevent implied global error in jslint
var Ti, Database;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#1a5384');

Ti.include(
// FERI libraries
'app/feri.js', 'app/ui.js', 'app/datetime.js',

// Database connection libraries
'database/database.js', 'database/db.js', 'database/db.insert.js', 'database/entity.js', 'database/entity.datastore.js',

// FERI specific Database entities
'app/entity.js');

// Register our database information.
Database.db.addConnectionInfo('main');
Ti.Database.install('main.sql', 'main');

// If we haven't created the tables yet, make empty ones to ensure that the
// app doesn't crash.
if (!Database.db.getConnection('main').tableExists('node')) {
  Database.entity.db('main', 'node').initializeSchema();
}
if (!Database.db.getConnection('main').tableExists('user')) {
  Database.entity.db('main', 'user').initializeSchema();
}
if (!Database.db.getConnection('main').tableExists('board_parents')) {
  Database.entity.db('main', 'board_parents').initializeSchema();
}
if (!Database.db.getConnection('main').tableExists('board_children')) {
  Database.entity.db('main', 'board_children').initializeSchema();
}
if (!Database.db.getConnection('main').tableExists('aktualne_diplome')) {
  Database.entity.db('main', 'aktualne_diplome').initializeSchema();
}
if (!Database.db.getConnection('main').tableExists('zadnje_diplome')) {
  Database.entity.db('main', 'zadnje_diplome').initializeSchema();
}

Ti.include(
// All FERI windows
'windows/ModalActivityIndicatorWindow.js', 'windows/BoardCatWindow.js', 'windows/BoardCatDetailWindow.js', 'windows/BoardWindow.js', 'windows/MapWindow.js', 'windows/AboutWindow.js', 'windows/PeopleWindow.js', 'windows/BoardDetailWindow.js', 'windows/PeopleDetailWindow.js', 'windows/InformacijeWindow.js', 'windows/UrnikiWindow.js', 'windows/UrnikiSelectionWindow.js', 'windows/UrnikiSelection2Window.js', 'windows/DiplomeWindow.js', 'windows/WebViewWindow.js', 'windows/DiplomeZadnjeWindow.js', 'windows/NastavitveWindow.js', 'windows/NastavitveBoardEditListWindow.js', 'windows/HtmlWindow.js',

// Create icons based on previous custom windows and
// load them into the main dashboard window
'app/icons.js', 'windows/main.js', 'app/push.js');

if (feri.testflight == true && !feri.isAndroid()) {
  // testflight
  var testflight = require('com.0x82.testflight');
  Ti.API.info("module is => " + testflight);

  // WARNING: ONLY USE THIS ON DEVELOPMENT! DON'T GO TO THE APP STORE WITH THIS LINE!!
  testflight.setDeviceIdenifier(Ti.Platform.id);
  testflight.takeOff('99487208b500edc7b5bc7b342d9e8fe0_MTEyODExMjAxMi0wNy0yMSAwNToyMzowNy4xMzYyMzM');
}
