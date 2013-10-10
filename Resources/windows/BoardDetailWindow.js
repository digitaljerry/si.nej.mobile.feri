(function() {

  feri.ui.createBoardDetailWindow = function(settings) {
    Database.setDefaults(settings, {
      title : 'title here',
      uid : ''
    });

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Board detail window");
    }

    var commonPadding = 15;
    var sessionDetailWindow = Titanium.UI.createWindow({
      id : 'boardDetailWindow',
      title : settings.title,
      barColor : feri.ui.barColor,
      backgroundColor : feri.ui.backgroundColor,
      fullscreen : false,
      tintColor: '#ffffff',
      navTintColor: '#ffffff'
    });
    sessionDetailWindow.orientationModes = [Ti.UI.PORTRAIT];

    // Build session data
    var sessionData = Database.entity.db('main', 'node').load(settings.uid);

    var tvData = [];
    var tv = Ti.UI.createTableView({
      textAlign : 'left',
      layout : 'vertical'
    });
    tv.footerView = Ti.UI.createView({
      height : 1,
      opacity : 0
    });

    var headerRow = Ti.UI.createTableViewRow({
      height : 'auto',
      left : 0,
      top : -5,
      bottom : 10,
      layout : 'vertical',
      className : 'mainHeaderRow',
      backgroundPosition : 'bottom left',
      selectionStyle : 'none'
    });

    var bodyRow = Ti.UI.createTableViewRow({
      hasChild : false,
      height : 'auto',
      left : 0,
      top : -5,
      bottom : 10,
      layout : 'vertical',
      className : 'bodyRow',
      selectionStyle : 'none',
      selectedBackgroundColor : feri.ui.selectedBackgroundColor
    });

    if (sessionData.title) {
      var titleLabel = Ti.UI.createLabel({
        text : feri.cleanSpecialChars(sessionData.title),
        font : {
          fontSize : 28,
          fontWeight : 'bold'
        },
        textAlign : 'left',
        color : feri.ui.darkText,
        left : commonPadding,
        top : 18,
        bottom : 7,
        right : commonPadding,
        height : 'auto'
      });
      headerRow.add(titleLabel);
    }

    var dateWithTime = '';
    if (sessionData.date) {

      var timestamp = feri.datetime.strtotime(sessionData.date);
      dateWithTime = feri.datetime.normalDate(timestamp) + ' ' + feri.datetime.cleanTime(sessionData.date);

      var datetime = Ti.UI.createLabel({
        text : dateWithTime,
        font : {
          fontSize : 18,
          fontWeight : 'normal'
        },
        textAlign : 'left',
        color : feri.ui.darkText,
        left : commonPadding,
        top : 'auto',
        bottom : 5,
        right : 'auto',
        height : 'auto'
      });
      headerRow.add(datetime);
    }

    var boardDetailWebview = Titanium.UI.createWebView({
      html : '<html><body style="font-family: Helvetica !important;"><p><h1 style="font-size: 28px;">' + sessionData.title + '</h1><h3 style="font-size: 18px;">' + dateWithTime + '</h3></p>' + sessionData.body + '</body></html>',
      height : '100%'
    });

    tvData.push(feri.ui.createHeaderRow(lang['obvestilo']));
    tvData.push(bodyRow);

    var toolbarActive = false;

    if (!feri.isAndroid()) {
      // open on web
      var bb2 = Titanium.UI.createButtonBar({
        labels : [lang['odpri_na_spletu']],
        backgroundColor : feri.ui.toolbarColor,
        height : 30
      });
      var flexSpace = Titanium.UI.createButton({
        systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });

      sessionDetailWindow.setToolbar([flexSpace, bb2, flexSpace]);

      bb2.addEventListener('click', function(ce) {
        openOnWeb(settings);
      });
    } else {
      var activity = sessionDetailWindow.activity;
      activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
        var menuItemOpen = menu.add({
          title : lang['odpri_na_spletu']
        });
        menuItemOpen.addEventListener("click", function(e) {
          openOnWeb(settings);
        });
      };
    }

    //tv.setData(tvData);
    //sessionDetailWindow.add(tv);
    sessionDetailWindow.add(boardDetailWebview);

    boardDetailWebview.addEventListener('load', function(e) {
      feri.ui.activityIndicator.hideModal();
      return;
    });

    function openOnWeb(settings) {
      var url = 'http://www.feri.uni-mb.si/odeska/brnj2.asp?id=' + settings.uid;
      if (feri.useDashboard) {
        feri.navGroup.open(feri.ui.createWebViewWindow({
          id : 'webviewWindow',
          url : url
        }), {
          animated : true
        });
      } else {
        feri.tabOglasna.open(feri.ui.createWebViewWindow({
          id : 'webviewWindow',
          url : url
        }), {
          animated : true
        });
      }
    }

    return sessionDetailWindow;
  };

})(); 