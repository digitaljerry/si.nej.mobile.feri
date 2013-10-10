(function() {
  feri.ui.createAboutWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("About window");
    }

    var aboutWindow = Titanium.UI.createWindow({
      id : 'aboutWindow',
      title : lang['feri'],
      backgroundColor : '#dddddd',
      barColor : feri.ui.barColor,
      navBarHidden : false,
      fullscreen : false,
      tintColor: '#ffffff',
      navTintColor: '#ffffff'
    });

    var version = Ti.App.getVersion();
    if ( Titanium.App.Properties.getString('locale') == 'en' ) {
      var feriWindow = Ti.UI.createWebView({
        url : '/pages/about_en.html'
      });
    } else {
      var feriWindow = Ti.UI.createWebView({
        url : '/pages/about.html'
      });
    }
    if ( Titanium.App.Properties.getString('locale') == 'en' ) {
      var appWindow = Ti.UI.createWebView({
        url : '/pages/app_en.html'
      });
    } else {
      var appWindow = Ti.UI.createWebView({
        url : '/pages/app.html'
      });
    }
    
    appWindow.addEventListener('load', function() {
      appWindow.evalJS("document.getElementById('version').innerText='" + version + "';");
    });

    var data = [{
      title : lang['feri'],
      view : feriWindow
    }, {
      title : lang['aplikacija'],
      view : appWindow
    }];
    aboutWindow.add(feri.ui.createTabbedScrollableView({
      data : data
    }));

    // android back button listener
    if (feri.isAndroid()) {
      aboutWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });
    }

    return aboutWindow;
  };
})(); 