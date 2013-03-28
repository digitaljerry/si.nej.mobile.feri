(function() {

  feri.ui.createMapWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Map window");
    }

    var mapWindow = Titanium.UI.createWindow({
      id : 'mapWindow',
      title : lang['win_map'],
      backgroundColor : '#FFF',
      barColor : feri.ui.barColor,
      height : '100%',
      fullscreen : false
    });

    var currentTab = 0;

    // create table view data object
    var duration = 250;
    var data = [{
      title : lang['pritlicje'],
      shortTitle : 'P',
      url : '/pages/maps/1_Pritlicje.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : 0
    }, {
      title : lang['nadstropje']+ ' 1',
      shortTitle : 'N1',
      url : '/pages/maps/2_Nadstropje1.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }, {
      title : lang['medetaza'],
      shortTitle : 'M',
      url : '/pages/maps/3_Medetaza.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }, {
      title : lang['nadstropje'] + ' 2',
      shortTitle : 'N2',
      url : '/pages/maps/4_Nadstropje2.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }, {
      title : lang['nadstropje'] + ' 3',
      shortTitle : 'N3',
      url : '/pages/maps/5_Nadstropje3.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }, {
      title : lang['nadstropje'] + ' 4',
      shortTitle : 'N4',
      url : '/pages/maps/6_Nadstropje4.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }, {
      title : lang['tf'],
      shortTitle : 'TF',
      url : '/pages/maps/TF.html',
      animateOut : {
        left : Ti.Platform.displayCaps.platformWidth,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      animateIn : {
        left : 0,
        top : feri.ui.tabBarHeight,
        duration : duration
      },
      left : Ti.Platform.displayCaps.platformWidth
    }];

    var tabbedBarView = Ti.UI.createView({
      backgroundColor : '#555',
      top : 0,
      height : feri.ui.tabBarHeight
    });
    var tabbedBar = Ti.UI.createView({
      top : 0,
      backgroundColor : '#000',
      height : feri.ui.tabBarHeight,
      width : Ti.Platform.displayCaps.platformWidth
    });

    for (var i = 0; i < data.length; i++) {
      var myEntry = data[i];

      myEntry.webview = Ti.UI.createWebView({
        url : myEntry.url,
        top : feri.ui.tabBarHeight,
        bottom : 0,
        left : myEntry.left,
        width : Ti.Platform.displayCaps.platformWidth
      });
      myEntry.webview.scalesPageToFit = true;

      var tabView = Ti.UI.createView({
        backgroundImage : (i == 0) ? '/images/buttonbar/button2_selected.png' : '/images/buttonbar/button2_unselected_shadowL.png',
        height : feri.ui.tabBarHeight,
        left : i * (Ti.Platform.displayCaps.platformWidth / data.length),
        right : Ti.Platform.displayCaps.platformWidth - ((parseInt(i) + 1) * (Ti.Platform.displayCaps.platformWidth / data.length)),
        index : i
      });

      var tabLabel = Ti.UI.createLabel({
        text : myEntry.shortTitle,
        textAlign : 'center',
        color : '#fff',
        height : 'auto',
        touchEnabled : false,
        font : {
          fontSize : 14,
          fontWeight : 'bold'
        }
      });
      tabView.addEventListener('click', function(e) {

        if (e.source.index === currentTab)
          return;

        if (e.source.index == 0) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 1) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 2) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 3) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 4) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 5) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
        } else if (e.source.index == 6) {
          data[0].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[1].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[2].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[3].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[4].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[5].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowR.png';
          data[6].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
        }

        for (var j = 0; j < data.length; j++) {
          if (!feri.isAndroid()) {

            data[currentTab].webview.animate(data[currentTab].animateOut, function() {

              if (e.source.index == 0) {
                data[0].webview.animate(data[0].animateIn);
              } else if (e.source.index == 1) {
                data[1].webview.animate(data[1].animateIn);
              } else if (e.source.index == 2) {
                data[2].webview.animate(data[2].animateIn);
              } else if (e.source.index == 3) {
                data[3].webview.animate(data[3].animateIn);
              } else if (e.source.index == 4) {
                data[4].webview.animate(data[4].animateIn);
              } else if (e.source.index == 5) {
                data[5].webview.animate(data[5].animateIn);
              } else if (e.source.index == 6) {
                data[6].webview.animate(data[6].animateIn);
              }

            });

          } else {

            data[currentTab].webview.left = Ti.Platform.displayCaps.platformWidth;

            if (e.source.index == 0) {
              data[0].webview.left = 0;
            } else if (e.source.index == 1) {
              data[1].webview.left = 0;
            } else if (e.source.index == 2) {
              data[2].webview.left = 0;
            } else if (e.source.index == 3) {
              data[3].webview.left = 0;
            } else if (e.source.index == 4) {
              data[4].webview.left = 0;
            } else if (e.source.index == 5) {
              data[5].webview.left = 0;
            } else if (e.source.index == 6) {
              data[6].webview.left = 0;
            }

          }

        }

        // store current index
        currentTab = e.source.index;
      });

      tabView.add(tabLabel);
      tabbedBar.add(tabView);
      myEntry.tabView = tabView;
    }

    tabbedBarView.add(tabbedBar);
    mapWindow.add(tabbedBarView);
    mapWindow.add(data[0].webview);
    mapWindow.add(data[1].webview);
    mapWindow.add(data[2].webview);
    mapWindow.add(data[3].webview);
    mapWindow.add(data[4].webview);
    mapWindow.add(data[5].webview);
    mapWindow.add(data[6].webview);

    // android back button listener
    if (feri.isAndroid()) {
      mapWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });
    }

    return mapWindow;
  };
})(); 