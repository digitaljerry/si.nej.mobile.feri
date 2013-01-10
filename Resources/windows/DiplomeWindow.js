(function() {
  feri.ui.createDiplomeWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Diplome window");
    }

    var diplomeWindow = Titanium.UI.createWindow({
      id : 'diplomeWindow',
      title : lang['diplome'],
      backgroundColor : '#FFF',
      barColor : feri.ui.barColor,
      navBarHidden : false,
      fullscreen : false
    });

    var data = [];
    function getDiplomeData() {
      var data = [];
      var conn = Database.db.getConnection('main');

      data.push(feri.ui.createHeaderRow(lang['aktualni_zagovori']));

      var rows = conn.query("SELECT uid FROM aktualne_diplome ORDER BY uid DESC LIMIT 25");

      var uids = [];

      while (rows.isValidRow()) {
        uids.push(rows.fieldByName('uid'));
        rows.next();
      }
      rows.close();

      // Create aktualne diploma rows
      var diplome = Database.entity.db('main', 'aktualne_diplome').loadMultiple(uids, ['uid'], false);
      for (var diplomeNum = 0, numDiplome = diplome.length; diplomeNum < numDiplome; diplomeNum++) {
        var diploma = diplome[diplomeNum];
        var diplomaTitle = feri.cleanSpecialChars(diploma.title);
        var diplomaRow = Ti.UI.createTableViewRow({
          hasChild : false,
          className : 'cs_session',
          selectedColor : '#000',
          backgroundColor : '#fff',
          color : '#000',
          details : diploma.details,
          uid : diploma.uid,
          diplomaTitle : diplomaTitle,
          height : 'auto',
          layout : 'vertical',
          search : diplomaTitle + ' ' + diploma.candidate,
          selectedBackgroundColor : feri.ui.selectedBackgroundColor
        });

        var leftSpace = 10;
        var titleColor = '#1C4980';

        var titleLabel = Ti.UI.createLabel({
          text : diplomaTitle,
          font : {
            fontSize : 16,
            fontWeight : 'bold'
          },
          color : titleColor,
          left : leftSpace,
          top : 10,
          bottom : 10,
          right : 10,
          height : 'auto',
          touchEnabled : false
        });

        // Some sessions have multiple people
        var authorLabel = Ti.UI.createLabel({
          text : diploma.candidate + ', ' + diploma.details,
          font : {
            fontSize : 14,
            fontWeight : 'normal'
          },
          color : '#000',
          left : leftSpace,
          top : 4,
          bottom : 10,
          right : 10,
          height : 'auto',
          touchEnabled : false
        });

        diplomaRow.add(titleLabel);
        diplomaRow.add(authorLabel);

        data.push(diplomaRow);
      }

      if (uids.length == 0) {
        var sessionRow = Ti.UI.createTableViewRow({
          hasChild : false,
          className : 'cs_session',
          date : '',
          uid : 0,
          height : 'auto',
          layout : 'vertical',
          color : feri.ui.inactiveText,
          focusable : false,
          title : lang['ni_aktualnih_zagovorov'],
          selectedBackgroundColor : feri.ui.selectedBackgroundColor
        });

        data.push(sessionRow);

        Ti.App.fireEvent('feri:update_data_diplome');
      }

      data.push(feri.ui.createHeaderRow(lang['zadnje_diplome']));

      var rows = conn.query("SELECT uid FROM zadnje_diplome ORDER BY uid DESC LIMIT 25");

      var uids = [];

      while (rows.isValidRow()) {
        uids.push(rows.fieldByName('uid'));
        rows.next();
      }
      rows.close();

      // Create zadnje diploma rows
      var diplome = Database.entity.db('main', 'zadnje_diplome').loadMultiple(uids, ['uid'], false);
      for (var diplomeNum = 0, numDiplome = diplome.length; diplomeNum < numDiplome; diplomeNum++) {
        var diploma = diplome[diplomeNum];
        var diplomaTitle = feri.cleanSpecialChars(diploma.title);
        var diplomaRow = Ti.UI.createTableViewRow({
          hasChild : true,
          className : 'cs_session',
          selectedColor : '#000',
          backgroundColor : '#fff',
          color : '#000',
          uid : diploma.uid,
          more : true,
          height : 'auto',
          layout : 'vertical',
          focusable : true,
          search : diplomaTitle + ' ' + diploma.author,
          selectedBackgroundColor : feri.ui.selectedBackgroundColor
        });

        var leftSpace = 10;
        var titleColor = '#1C4980';

        var titleLabel = Ti.UI.createLabel({
          text : diplomaTitle,
          font : {
            fontSize : 16,
            fontWeight : 'bold'
          },
          color : titleColor,
          left : leftSpace,
          top : 10,
          bottom : 10,
          right : 10,
          height : 'auto',
          touchEnabled : false
        });

        // Some sessions have multiple people
        var authorLabel = Ti.UI.createLabel({
          text : diploma.author,
          font : {
            fontSize : 14,
            fontWeight : 'normal'
          },
          color : '#000',
          left : leftSpace,
          top : 4,
          bottom : 10,
          right : 10,
          height : 'auto',
          touchEnabled : false
        });

        diplomaRow.add(titleLabel);
        diplomaRow.add(authorLabel);

        data.push(diplomaRow);
      }

      data.push(feri.ui.createHeaderRow(lang['dkum']));

      var tableRow = Ti.UI.createTableViewRow({
        hasChild : true,
        className : 'cs_session',
        selectedColor : '#000',
        backgroundColor : '#fff',
        color : '#000',
        //height: 'auto',
        layout : 'vertical',
        //focusable: true,
        title : lang['vec_diplom_na_dkum'],
        dkum : true,
        selectedBackgroundColor : feri.ui.selectedBackgroundColor
      });

      var titleLabel = Ti.UI.createLabel({
        text : '',
        font : {
          fontSize : 16,
          fontWeight : 'bold'
        },
        top : 10,
        right : 10,
        touchEnabled : false
      });
      data.push(tableRow);

      return data;
    }

    diplomeTableView = Titanium.UI.createTableView({
      data : getDiplomeData(),
      filterAttribute : 'search'
    });

    // make it searchable
    //feri.getSearchbar(diplomeTableView);

    diplomeWindow.add(diplomeTableView);

    diplomeTableView.addEventListener('click', function(e) {

      if (e.rowData.dkum == true) {
        if (feri.useDashboard) {
          feri.navGroup.open(feri.ui.createWebViewWindow({
            url : 'http://dkum.uni-mb.si/Iskanje.php?type=napredno&niz0=&vrsta=dip&vir=3&chkFullOnly=on'
          }), {
            animated : true
          });
        } else {
          feri.tabDiplome.open(feri.ui.createWebViewWindow({
            url : 'http://dkum.uni-mb.si/Iskanje.php?type=napredno&niz0=&vrsta=dip&vir=3&chkFullOnly=on'
          }), {
            animated : true
          });
        }
      } else if (e.rowData.more == true) {
        if (feri.useDashboard) {
          feri.navGroup.open(feri.ui.createDiplomeZadnjeWindow({
            uid : e.rowData.uid
          }), {
            animated : true
          });
        } else {
          feri.tabDiplome.open(feri.ui.createDiplomeZadnjeWindow({
            uid : e.rowData.uid
          }), {
            animated : true
          });
        }
      }
    });

    Ti.App.addEventListener('refresh:diplome', function() {
      diplomeTableView.setData(getDiplomeData());
    });

    // android back button listener and refresh menu
    if (feri.isAndroid()) {
      diplomeWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });

      var activity = diplomeWindow.activity;
      activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
        var menuItemRefresh = menu.add({
          title : lang['osvezi']
        });
        menuItemRefresh.addEventListener("click", function(e) {
          Ti.App.fireEvent('feri:update_data_diplome');
        });
      };
    }

    return diplomeWindow;
  };
})();
