(function() {

  if (Titanium.App.Properties.getString('feri.mainView') != 'tabs' || feri.isAndroid()) {
    feri.useDashboard = true;
  } else {
    feri.useDashboard = false;
  }

  if (feri.useDashboard) {

    var i = 0;
    var navWindow;
    var mainWindow = Ti.UI.createWindow({
      id : 'mainWindow',
      backgroundImage : feri.ui.mainBackgroundImage,
      title : 'Dashboard',
      navBarHidden : true,
      exitOnClose : true
    });
    var viewIcons = Ti.UI.createView({
      height : feri.ui.dashboardHeight,
      width : feri.ui.dashboardWidth,
      bottom : 45,
      borderRadius : 0,
      layout : 'horizontal'
    });
    mainWindow.add(viewIcons);

    // handle cross-platform navigation
    if (feri.isAndroid()) {
      feri.navGroup = {
        open : function(win, obj) {
          win.open(obj);
        },
        close : function(win, obj) {
          win.close(obj);
        }
      };
      navWindow = mainWindow;
    } else {
      navWindow = Ti.UI.createWindow();
      feri.navGroup = Ti.UI.iPhone.createNavigationGroup({
        window : mainWindow
      });
      navWindow.add(feri.navGroup);
    }

    // lock orientation to portrait
    navWindow.orientationModes = [Ti.UI.PORTRAIT];
    if (!feri.isAndroid()) {
      Ti.UI.orientation = Ti.UI.PORTRAIT;
    }

    // Create each dashboard icon and include necessary properties
    // for any windows it opens.
    var createIcon = function(icon) {
      feri.iconWin = undefined;
      var view = Ti.UI.createView({
        backgroundImage : icon.image,
        top : 0,
        height : feri.ui.icons.height,
        width : feri.ui.icons.width
      });
      view.addEventListener('click', function(e) {

        // preventing clicks on the dashboard after some icon was already clicked
        if (feri.dashboardActive == false)
          return;
        else
          feri.dashboardActive = false;

        // feedback on the icon when clicked
        icon.imageActive = 'undefined';
        view.backgroundImage = icon.imageActive;

        var ind = Titanium.UI.createActivityIndicator({
          width : 50,
          height : 50,
          message : ''
        });
        view.add(ind);
        ind.show();

        feri.iconWin = icon.func(icon.args);

        // add a left navigation button for ios
        if (!feri.isAndroid()) {
          var leftButton = Ti.UI.createButton({
            backgroundImage : '/images/6dots.png',
            width : 41,
            height : 30
          });
          leftButton.addEventListener('click', function() {
            feri.navGroup.close(feri.iconWin, {
              animated : true
            });
            // re-enabling the icons on the dashboard
            feri.dashboardActive = true;
          });
          feri.iconWin.leftNavButton = leftButton;
        }

        // adding refresh icon click for iPhone
        if (icon.refresh) {
          if (!feri.isAndroid()) {
            var rightButton = Ti.UI.createButton({
              systemButton : Ti.UI.iPhone.SystemButton.REFRESH
            });
            feri.iconWin.rightNavButton = rightButton;
            rightButton.addEventListener('click', function() {
              if (icon.name == 'board')
                Ti.App.fireEvent('feri:update_data_oglasna');
              else if (icon.name == 'people')
                Ti.App.fireEvent('feri:update_data_zaposleni');
              else if (icon.name == 'diplome')
                Ti.App.fireEvent('feri:update_data_diplome');
            });
          }
        }

        // add sessions and speaker refresh
        if (icon.urniki) {
          var rightButton = Ti.UI.createButton({
            systemButton : Ti.UI.iPhone.SystemButton.BOOKMARKS
          });
          feri.iconWin.rightNavButton = rightButton;
          rightButton.addEventListener('click', function() {
            Ti.App.fireEvent('feri:set_urniki');
          });
        }

        if (icon.badgeReset && !feri.isAndroid()) {
          Titanium.UI.iPhone.setAppBadge(0);
        }

        feri.iconWin.navBarHidden = false;
        feri.navGroup.open(feri.iconWin, {
          animated : true
        });

        // bring the icon back
        ind.hide();
        view.backgroundImage = icon.image;
      });

      return view;
    };

    // Layout the dashboard icons
    for ( i = 0; i < feri.ui.icons.list.length; i++) {
      viewIcons.add(createIcon(feri.ui.icons.list[i]));
    }

    if (feri.isAndroid()) {
      mainWindow.open({
        animated : true
      });
    } else {
      navWindow.open({
        transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
      });
    }

  } else {

    var imageSuffix = '';
    if (feri.isLargeScreen()) {
      imageSuffix = '@2x';
    }

    // create tab group
    var tabGroup = Titanium.UI.createTabGroup({
      barColor : '#004586',
      allowUserCustomization : false
    });

    var winOglasna = feri.ui.createBoardWindow();
    feri.tabOglasna = Titanium.UI.createTab({
      icon : '/images/dashboard/oglasnaTab' + imageSuffix + '.png',
      title : lang['win_oglasna'],
      window : winOglasna
    });
    var winUrniki = feri.ui.createUrnikiWindow();
    feri.tabUrniki = Titanium.UI.createTab({
      icon : '/images/dashboard/urnikiTab' + imageSuffix + '.png',
      title : lang['win_urniki'],
      window : winUrniki
    });
    var winZaposleni = feri.ui.createPeopleWindow();
    feri.tabPeople = Titanium.UI.createTab({
      icon : '/images/dashboard/zaposleniTab' + imageSuffix + '.png',
      title : lang['win_people'],
      window : winZaposleni
    });
    feri.tabMap = Titanium.UI.createTab({
      icon : '/images/dashboard/zemljevidTab' + imageSuffix + '.png',
      title : lang['win_map'],
      window : feri.ui.createMapWindow()
    });
    var winDiplome = feri.ui.createDiplomeWindow();
    feri.tabDiplome = Titanium.UI.createTab({
      icon : '/images/dashboard/diplomeTab' + imageSuffix + '.png',
      title : lang['win_diplome'],
      window : winDiplome
    });
    feri.tabInformacije = Titanium.UI.createTab({
      icon : '/images/dashboard/informacijeTab' + imageSuffix + '.png',
      title : lang['win_informacije'],
      window : feri.ui.createInformacijeWindow()
    });
    feri.tabNastavitve = Titanium.UI.createTab({
      icon : '/images/dashboard/nastavitveTab' + imageSuffix + '.png',
      title : lang['win_nastavitve'],
      window : feri.ui.createNastavitveWindow()
    });
    feri.tabAbout = Titanium.UI.createTab({
      icon : '/images/dashboard/aboutTab' + imageSuffix + '.png',
      title : lang['feri'],
      window : feri.ui.createAboutWindow()
    });

    // refresh buttons
    var rightButtonOglasna = Ti.UI.createButton({
      systemButton : Ti.UI.iPhone.SystemButton.REFRESH
    });
    winOglasna.rightNavButton = rightButtonOglasna;
    rightButtonOglasna.addEventListener('click', function() {
      Ti.App.fireEvent('feri:update_data_oglasna');
    });
    var rightButtonDiplome = Ti.UI.createButton({
      systemButton : Ti.UI.iPhone.SystemButton.REFRESH
    });
    winDiplome.rightNavButton = rightButtonDiplome;
    rightButtonDiplome.addEventListener('click', function() {
      Ti.App.fireEvent('feri:update_data_diplome');
    });
    var rightButtonZaposleni = Ti.UI.createButton({
      systemButton : Ti.UI.iPhone.SystemButton.REFRESH
    });
    winZaposleni.rightNavButton = rightButtonZaposleni;
    rightButtonZaposleni.addEventListener('click', function() {
      Ti.App.fireEvent('feri:update_data_zaposleni');
    });
    var rightButtonUrniki = Ti.UI.createButton({
      systemButton : Ti.UI.iPhone.SystemButton.BOOKMARKS
    });
    winUrniki.rightNavButton = rightButtonUrniki;
    rightButtonUrniki.addEventListener('click', function() {
      Ti.App.fireEvent('feri:set_urniki');
    });

    //
    //  add tabs
    //
    tabGroup.addTab(feri.tabOglasna);
    tabGroup.addTab(feri.tabUrniki);
    tabGroup.addTab(feri.tabPeople);
    tabGroup.addTab(feri.tabMap);
    tabGroup.addTab(feri.tabDiplome);
    tabGroup.addTab(feri.tabInformacije);
    tabGroup.addTab(feri.tabNastavitve);
    tabGroup.addTab(feri.tabAbout);

    // open tab group
    tabGroup.open();
  }

  Ti.App.addEventListener('feri:update_data', function(e) {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("feri:update_data");
    }

    feri.ui.activityIndicator.showModal(lang['posodabljam'], feri.updateTimeout, lang['napaka_pri_povezavi']);
    Database.entity.db('main', 'user').fetchUpdates('user');
    Database.entity.db('main', 'node').fetchUpdates('node');
    Database.entity.db('main', 'aktualne_diplome').fetchUpdates('aktualne_diplome');
    Database.entity.db('main', 'zadnje_diplome').fetchUpdates('zadnje_diplome');
  });

  Ti.App.addEventListener('feri:update_data_oglasna', function(e) {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("feri:update_data_oglasna");
    }

    feri.ui.activityIndicator.showModal(lang['posodabljam'], feri.updateTimeout, lang['napaka_pri_povezavi']);
    Database.entity.db('main', 'node').fetchUpdates('node');
  });

  Ti.App.addEventListener('feri:update_data_diplome', function(e) {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("feri:update_data_diplome");
    }

    feri.ui.activityIndicator.showModal(lang['posodabljam'], feri.updateTimeout, lang['napaka_pri_povezavi']);
    Database.entity.db('main', 'aktualne_diplome').fetchUpdates('aktualne_diplome');
    Database.entity.db('main', 'zadnje_diplome').fetchUpdates('zadnje_diplome');
  });

  Ti.App.addEventListener('feri:update_data_zaposleni', function(e) {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("feri:update_data_zaposleni");
    }

    feri.ui.activityIndicator.showModal(lang['posodabljam'], feri.bigUpdateTimeout, lang['napaka_pri_povezavi']);
    Database.entity.db('main', 'user').fetchUpdates('user');
    
    var timestamp = String(new Date().getTime());
    Titanium.App.Properties.setString('last_people_update', timestamp);
  });

  Ti.App.addEventListener('feri:flip_oglasna_deska', function(e) {
    if (!feri.isAndroid()) {
      feri.tableviewFirst.show();
      feri.tableview.hide();
    }
    feri.boardWindow.setTitle(lang['deska']);
    Titanium.App.Properties.setString('boardLatest', 'category');
  });

  Ti.App.addEventListener('feri:flip_oglasna_aktualno', function(e) {
    if (!feri.isAndroid()) {
      feri.tableview.show();
      feri.tableviewFirst.hide();
    }
    feri.boardWindow.setTitle(lang['aktualno']);
    Titanium.App.Properties.setString('boardLatest', 'latest');
  });

  Ti.App.addEventListener('feri:fix_tables', function(e) {
    Database.entity.db('main', 'board_parents').fixTables('board_parents');
    Database.entity.db('main', 'board_children').fixTables('board_children');
    Database.entity.db('main', 'aktualne_diplome').fixTables('aktualne_diplome');
    Database.entity.db('main', 'zadnje_diplome').fixTables('zadnje_diplome');
    Database.entity.db('main', 'user').fixTables('user');
  });

  Ti.App.addEventListener('feri:openExternalURL', function(e) {
    Ti.Platform.openURL(e.url);
  });
  
  Ti.App.addEventListener('restartApp', function(e) {
    var a = Titanium.UI.createAlertDialog({
      message : lang['lang_change_restart']
    });
    a.buttonNames = ['OK'];
    a.show();
  });

  if (Titanium.App.Properties.getString('feri.refreshOnShake') == '' || Titanium.App.Properties.getString('feri.refreshOnShake') == 'undefined') {
    Titanium.App.Properties.setString('feri.refreshOnShake', 'true');
  }

  Ti.Gesture.addEventListener('shake', function(e) {
    if (Titanium.App.Properties.getString('feri.refreshOnShake') == 'true') {

      if (feri.testflight == true && !feri.isAndroid()) {
        testflight.passCheckpoint("feri:refreshOnShake");
      }

      Ti.App.fireEvent('feri:update_data_oglasna');
      //Ti.App.fireEvent('feri:fix_tables');
    }
  });

  // check if we need to reload data on load
  if (Titanium.App.Properties.getString('feri.refreshOnLoad') == 'true') {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("feri:update_data_oglasna");
    }

    Ti.App.fireEvent('feri:update_data_oglasna');
  }

  if (Titanium.App.Properties.getString('feri.initialStart') != 'false') {
    setTimeout(function() {
      Ti.App.fireEvent('feri:update_data_oglasna');
      Titanium.App.Properties.setString('feri.initialStart', 'false');
    }, 1000);
  }

})(); 