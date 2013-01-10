(function() {
  feri.ui.createUrnikiWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Urniki window");
    }

    var diff = 0;
    feri.urniki_url = 'http://www.feri.uni-mb.si/urniki1/groups.php';

    var urnikiWindow = Titanium.UI.createWindow({
      id : 'urnikiWindow',
      title : lang['win_urniki'],
      backgroundColor : feri.ui.urnikiColor,
      barColor : feri.ui.barColor,
      navBarHidden : false,
      fullscreen : false
    });

    var webview = Ti.UI.createWebView({
      backgroundColor : feri.ui.urnikiColor,
      width : '100%',
      height : '100%'
    });

    webview.addEventListener('load', function() {
      feri.ui.activityIndicator.hideModal();
    });

    refreshUrniki();

    // adding the view
    urnikiWindow.add(webview);

    if (!feri.isAndroid()) {
      // reload controls listeners
      var bb2 = Titanium.UI.createButtonBar({
        labels : [lang['prejsnji'], lang['trenutni_teden'], lang['naslednji']],
        backgroundColor : feri.ui.toolbarColor,
        height : 30
      });
      var flexSpace = Titanium.UI.createButton({
        systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });

      urnikiWindow.setToolbar([flexSpace, bb2, flexSpace]);

      bb2.addEventListener('click', function(ce) {
        if (ce.index == 0) {
          if (diff > 0)
            diff = 0;

          diff = diff - 1;
          refreshUrniki(diff);
        } else if (ce.index == 1) {
          diff = 0;
          refreshUrniki(diff);
        } else {
          if (diff < 0)
            diff = 0;

          diff = diff + 1;
          refreshUrniki(diff);
        }
      });
    } else {
      var activity = urnikiWindow.activity;
      activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
        var menuItemBack = menu.add({
          title : lang['prejsnji_teden']
        });
        menuItemBack.addEventListener("click", function(e) {
          if (diff > 0)
            diff = 0;

          diff = diff - 1;
          refreshUrniki(diff);
        });
        var menuItemRefresh = menu.add({
          title : lang['trenutni_teden']
        });
        menuItemRefresh.addEventListener("click", function(e) {
          diff = 0;
          refreshUrniki(diff);
        });
        var menuItemForward = menu.add({
          title : lang['naslednji_teden']
        });
        menuItemForward.addEventListener("click", function(e) {
          if (diff < 0)
            diff = 0;

          diff = diff + 1;
          refreshUrniki(diff);
        });
        var menuItemSet = menu.add({
          title : lang['izberi_studij']
        });
        menuItemSet.addEventListener("click", function(e) {
          Ti.App.fireEvent('feri:set_urniki');
        });
      };
    }

    // android back button listener
    if (feri.isAndroid()) {
      urnikiWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });
    }

    Ti.App.addEventListener('feri:set_urniki', function() {
      if (feri.useDashboard) {
        feri.navGroup.open(feri.ui.createUrnikiSelectionWindow({
          title : lang['urniki']
        }), {
          animated : true
        });
      } else {
        feri.tabUrniki.open(feri.ui.createUrnikiSelectionWindow({
          title : lang['urniki']
        }), {
          animated : true
        });
      }
    });

    // new urnik was selected so we need to refresh
    urnikiWindow.addEventListener('focus', function() {
      if (Titanium.App.Properties.getString('urniki_changed') == 'true') {
        refreshUrniki(0);
        Titanium.App.Properties.setString('urniki_changed', 'false');
      }
    });

    function refreshUrniki(customDate) {

      // we try to get th efirst request from cache
      var urniki_local = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'urniki_cached.html');

      if (urniki_local.exists() && customDate === undefined) {

        webview.url = urniki_local.read().nativePath;
        webview.setVisible(true);

      } else {

        // copying needed files
        var designDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'design');
        if (!designDir.exists())
          designDir.createDirectory();
        var fromFile = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'design/design.css');
        var toFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'design/design.css');
        if (fromFile.exists() && (!toFile.exists())) {
          toFile.write(fromFile.read());
        }

        feri.ui.activityIndicator.showModal(lang['nalagam'], feri.loadLongTimeout, lang['napaka_pri_povezavi']);

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('POST', feri.urniki_url);
        //xhr.setRequestHeader('Content-Type', 'text/html; charset=windows-1250');
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //xhr.setRequestHeader('Accept-Charset', 'ISO-8859-1,utf-8;q=0.7,*;q=0.3');
        //xhr.setRequestHeader('Content-Type', 'text/html; charset=windows-1250');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
          webview.setVisible(true);
          feri.ui.activityIndicator.hideModal();

          // we cache it
          urniki_local.write(this.getResponseData());

          // remove the view and add it again, so it gets redrawn correctly
          urnikiWindow.remove(webview);
          webview = null;
          webview = Ti.UI.createWebView({
            backgroundColor : feri.ui.urnikiColor,
            width : '100%',
            height : '100%',
            url : urniki_local.nativePath
          });
          urnikiWindow.add(webview);
        };

        var groups = Titanium.App.Properties.getString('urniki_groups');
        var branch = Titanium.App.Properties.getString('urniki_branch');

        // set the date
        var date = getDate(customDate);

        xhr.send({
          date_field : date,
          branch_id : branch,
          //program_index:"15",
          //groups_index:"1,2,3,4,5,6,7,8,9",
          groups_values : groups
        });

      }

    }

    function getDate(custom) {

      var today = new Date();
      if (custom !== undefined)
        today = addDays(today, custom * 7);

      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      //January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var today = mm + '/' + dd + '/' + yyyy;
      var date = dd + '.' + mm + '.' + yyyy;

      return date;
    }

    function addDays(myDate, days) {
      return new Date(myDate.getTime() + days * 24 * 60 * 60 * 1000);
    }

    return urnikiWindow;
  };
})(); 