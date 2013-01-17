(function() {

  feri.ui.createNastavitveWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Nastavitve window");
    }

    var NastavitveWindow = Titanium.UI.createWindow({
      id : 'nastavitveWindow',
      title : lang['win_nastavitve'],
      backgroundColor : '#FFF',
      barColor : feri.ui.barColor,
      fullscreen : false
    });

    // Create the table view
    if (!feri.isAndroid()) {
      var inputData = [{
        title : lang['dashboard'],
        switchAppUse : 'dashboard',
        header : lang['oblika']
      }, {
        title : lang['zavihki'],
        switchAppUse : 'tabs'
      }, {
        title : lang['slovenski'],
        switchLang : 'sl',
        header : lang['lang']
      }, {
        title : lang['english'],
        switchLang : 'en'
      }];

      if (feri.useDashboard == true)
        inputData[0].hasCheck = true;
      else
        inputData[1].hasCheck = true;
    } else {
      var inputData = [{
        title : lang['slovenski'],
        switchLang : 'sl',
        header : lang['lang']
      }, {
        title : lang['english'],
        switchLang : 'en'
      }];
    }
    
    if (!feri.isAndroid()) {
      if (Titanium.App.Properties.getString('locale') == 'sl')
        inputData[2].hasCheck = true;
      else
        inputData[3].hasCheck = true;
    } else {
      if (Titanium.App.Properties.getString('locale') == 'sl')
        inputData[0].hasCheck = true;
      else
        inputData[1].hasCheck = true;
    }

    var row1 = Ti.UI.createTableViewRow({
      height : 50,
      title : lang['shake_to_reload'],
      color : feri.ui.darkText,
      header : lang['oglasna_deska'],
      refreshOnShake : true
    });

    if (feri.isAndroid()) {
      var titleLabel1 = Ti.UI.createLabel({
        text : lang['shake_to_reload'],
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        color : feri.ui.darkText,
        left : 10,
        top : 10,
        bottom : 10,
        right : 10,
        height : 'auto',
      });
      row1.add(titleLabel1);
    }

    var sw1 = Ti.UI.createSwitch({
      right : 10,
      value : false
    });
    var row2 = Ti.UI.createTableViewRow({
      height : 50,
      title : lang['osvezi_ob_zagonu'],
      refreshOnLoad : true
    });
    var row5 = Ti.UI.createTableViewRow({
      height : 50,
      title : 'Push obvestila',
      color : feri.ui.darkText,
      pushRegister : true
    });

    if (feri.isAndroid()) {
      var titleLabel5 = Ti.UI.createLabel({
        text : lang['push_obvestila'],
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        color : feri.ui.darkText,
        left : 10,
        top : 10,
        bottom : 10,
        right : 10,
        height : 'auto',
      });
      row5.add(titleLabel5);
    }

    var sw5 = Ti.UI.createSwitch({
      right : 10,
      value : false
    });

    var row3 = Ti.UI.createTableViewRow({
      height : 50,
      title : lang['priljubljene'],
      editList : 'favorites',
      hasChild : true
    });
    var row4 = Ti.UI.createTableViewRow({
      height : 50,
      title : lang['push_kategorije'],
      editList : 'push',
      hasChild : true
    });

    if (feri.isAndroid()) {
      var titleLabel2 = Ti.UI.createLabel({
        text : lang['osvezi_ob_zagonu'],
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        color : feri.ui.darkText,
        left : 10,
        top : 10,
        bottom : 10,
        right : 10,
        height : 'auto',
      });
      row2.add(titleLabel2);

      var titleLabel3 = Ti.UI.createLabel({
        text : lang['priljubljene'],
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        color : feri.ui.darkText,
        left : 10,
        top : 10,
        bottom : 10,
        right : 10,
        height : 'auto',
      });
      row3.add(titleLabel3);

      var titleLabel4 = Ti.UI.createLabel({
        text : lang['push_kategorije'],
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        color : feri.ui.darkText,
        left : 10,
        top : 10,
        bottom : 10,
        right : 10,
        height : 'auto',
      });
      row4.add(titleLabel4);
    }
    var sw2 = Ti.UI.createSwitch({
      right : 10,
      value : false
    });

    if (Titanium.App.Properties.getString('feri.refreshOnShake') == 'true')
      sw1.value = true;
    if (Titanium.App.Properties.getString('feri.refreshOnLoad') == 'true')
      sw2.value = true;
    if (Titanium.App.Properties.getString('push') == 'true')
      sw5.value = true;

    row1.add(sw1);
    row2.add(sw2);
    row5.add(sw5);

    inputData.push(row1);
    inputData.push(row2);
    inputData.push(row5);
    inputData.push(row3);
    inputData.push(row4);

    var oglasnaDeskaSettings = [{
      title : lang['priljubljene'],
      editList : 'favorites',
      header : lang['oglasna_deska']
    }, {
      title : lang['push_kategorije'],
      editList : 'push'
    }];

    inputData.push(oglasnaDeskaSettings);

    if (feri.testflight == true && !feri.isAndroid()) {
      var row99 = Ti.UI.createTableViewRow({
        height : 50,
        title : 'Pošlji feedback',
        feedback : true,
        hasChild : true,
        header : 'Samo v beta verziji'
      });
      inputData.push(row99);
    }

    var tableView = Titanium.UI.createTableView({
      data : inputData
    });

    if (!feri.isAndroid())
      tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;

    // create table view event listener
    tableView.addEventListener('click', function(e) {

      var section = e.section;
      
      // app use switch
      if (e.rowData.switchAppUse) {
        if (e.rowData.switchAppUse == 'dashboard' && feri.useDashboard == false) {
          section.rows[0].hasCheck = true;
          section.rows[1].hasCheck = false;
          Titanium.App.Properties.setString('feri.mainView', 'dashboard');
          feri.useDashboard = true;
          feri.dashboardActive = true;
          Ti.include('windows/main.js');
        } else if (e.rowData.switchAppUse == 'tabs' && feri.useDashboard == true) {
          section.rows[0].hasCheck = false;
          section.rows[1].hasCheck = true;
          Titanium.App.Properties.setString('feri.mainView', 'tabs');
          feri.useDashboard = false;
          feri.dashboardActive = true;
          feri.ui.activityIndicator.showModal('Posodabljam ...');
          Ti.include('windows/main.js');
        }
      }
      if (e.rowData.switchLang) {
        if (e.rowData.switchLang == 'sl' && Titanium.App.Properties.getString('locale') != 'sl') {
          section.rows[0].hasCheck = true;
          section.rows[1].hasCheck = false;
          Titanium.App.Properties.setString('locale', 'sl');
          Titanium.include ('lang/sl.js');
          //feri.ui.activityIndicator.showModal('Posodabljam ...');
          //Ti.include('windows/main.js');
          //Titanium.App.Properties.setString('feri.mainView', 'dashboard');
          //feri.useDashboard = true;
          //feri.dashboardActive = true;
          //if ( feri.iconsView !== undefined ) {
          Ti.App.fireEvent('restartApp');
          //}
          //Ti.include('windows/main.js');
        } else if (e.rowData.switchLang == 'en' && Titanium.App.Properties.getString('locale') != 'en') {
          section.rows[0].hasCheck = false;
          section.rows[1].hasCheck = true;
          Titanium.App.Properties.setString('locale', 'en');
          Titanium.include ('lang/en.js');
          //feri.ui.activityIndicator.showModal('Posodabljam ...');
          //Ti.include('windows/main.js');
          //Titanium.App.Properties.setString('feri.mainView', 'dashboard');
          //feri.useDashboard = true;
          //feri.dashboardActive = true;
          //if ( feri.iconsView !== undefined ) {
          Ti.App.fireEvent('restartApp');
          //}
          //Ti.include('windows/main.js');
        }
      }

      if (e.rowData.editList == 'favorites') {

        if (feri.useDashboard) {
          feri.navGroup.open(feri.ui.createNastavitveBoardEditListWindow({
            id : 'nastavitveBoardEditListWindow',
            title : lang['priljubljene'],
            edit : e.rowData.editList
          }), {
            animated : true
          });
        } else {
          feri.tabOglasna.open(feri.ui.createNastavitveBoardEditListWindow({
            id : 'nastavitveBoardEditListWindow',
            title : lang['priljubljene'],
            edit : e.rowData.editList
          }), {
            animated : true
          });
        }

      } else if (e.rowData.editList == 'push') {

        if (feri.useDashboard) {
          feri.navGroup.open(feri.ui.createNastavitveBoardEditListWindow({
            id : 'nastavitveBoardEditListWindow',
            title : lang['push_obvestila'],
            edit : e.rowData.editList
          }), {
            animated : true
          });
        } else {
          feri.tabOglasna.open(feri.ui.createNastavitveBoardEditListWindow({
            id : 'nastavitveBoardEditListWindow',
            title : lang['push_obvestila'],
            edit : e.rowData.editList
          }), {
            animated : true
          });
        }

      }

      if (feri.testflight == true && !feri.isAndroid() && e.rowData.feedback == true) {
        Ti.API.warn("Open Feedback View");
        testflight.openFeedbackView();
      }

    });

    sw1.addEventListener('change', function(e) {
      if (e.value)
        Titanium.App.Properties.setString('feri.refreshOnShake', 'true');
      else
        Titanium.App.Properties.setString('feri.refreshOnShake', 'false');
    });

    sw2.addEventListener('change', function(e) {
      if (e.value)
        Titanium.App.Properties.setString('feri.refreshOnLoad', 'true');
      else
        Titanium.App.Properties.setString('feri.refreshOnLoad', 'false');
    });

    sw5.addEventListener('change', function(e) {
      if (e.value)
        feri.registerForPush();
      else
        feri.unregisterForPush();
    });

    // add table view to the window
    NastavitveWindow.add(tableView);

    // android back button listener
    if (feri.isAndroid()) {
      NastavitveWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });
    }

    return NastavitveWindow;
  };

})(); 