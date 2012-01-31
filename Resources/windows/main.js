
(function () {
    var updateTimeout = 25000;
    var i = 0;
    var navWindow;
    var mainWindow = Ti.UI.createWindow({
        backgroundImage: feri.ui.mainBackgroundImage,
        title: 'Dashboard',
        navBarHidden: true,
        exitOnClose: true
    });
    var viewFade = Ti.UI.createView({
        backgroundColor: '#fff',
        borderColor: '#FF7132',
        borderWidth: 4,
        height: feri.ui.dashboardHeight,
        width: feri.ui.dashboardWidth,
        bottom: 20,
        opacity: 0.75,
        borderRadius: 8
    });
    var viewIcons = Ti.UI.createView({
        height: feri.ui.dashboardHeight,
        width: feri.ui.dashboardWidth,
        bottom: 20,
        borderRadius: 0,
        layout: 'horizontal'
    });
    mainWindow.add(viewFade);
    mainWindow.add(viewIcons);

    // handle cross-platform navigation
    if (feri.isAndroid()) {
        feri.navGroup = {
            open: function (win, obj) {
                win.open(obj);
            },
            close: function (win, obj) {
                win.close(obj);
            }
        };
        navWindow = mainWindow;
    } else {
        navWindow = Ti.UI.createWindow();
        feri.navGroup = Ti.UI.iPhone.createNavigationGroup({
            window: mainWindow
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
    var createIcon = function (icon) {
        feri.iconWin = undefined;
        var view = Ti.UI.createView({
            backgroundImage: icon.image,
            top: 0,
            height: feri.ui.icons.height,
            width: feri.ui.icons.width
        });
        view.addEventListener('click', function (e) {
            feri.iconWin = icon.func(icon.args);
            feri.iconWin.orientationModes = [Ti.UI.PORTRAIT];

            // add a left navigation button for ios
            if (!feri.isAndroid()) {
                var leftButton = Ti.UI.createButton({
                    backgroundImage: 'images/6dots.png',
                    width: 41,
                    height: 30
                });
                leftButton.addEventListener('click', function () {
                    feri.navGroup.close(feri.iconWin, {
                        animated: true
                    });
                });
                feri.iconWin.leftNavButton = leftButton;
            }

            // add sessions and speaker refresh 
            if (icon.refresh) {
                if (feri.isAndroid()) {
                    feri.iconWin.addEventListener('open', function () {
                        feri.android.menu.init({
                            win: feri.iconWin,
                            buttons: [{
                                title: "Update",
                                clickevent: function () {
                                    Ti.fireEvent('feri:update_data');
                                }
                            }]
                        });
                    });
                } else {
                    var rightButton = Ti.UI.createButton({
                        systemButton: Ti.UI.iPhone.SystemButton.REFRESH
                    });
                    feri.iconWin.rightNavButton = rightButton;
                    rightButton.addEventListener('click', function () {
                        Ti.fireEvent('feri:update_data');
                    });
                }
            }
            
            if (icon.flip) {
                if (feri.isAndroid()) {
                    feri.iconWin.addEventListener('open', function () {
                        feri.android.menu.init({
                            win: feri.iconWin,
                            buttons: [{
                                title: "Flip",
                                clickevent: function () {
                                    Ti.fireEvent('feri:flip_oglasna');
                                }
                            }]
                        });
                    });
                } else {
                    var rightButton = Ti.UI.createButton({
                        systemButton: Ti.UI.iPhone.SystemButton.BOOKMARKS
                    });
                    feri.iconWin.rightNavButton = rightButton;
                    rightButton.addEventListener('click', function () {
                        Ti.fireEvent('feri:flip_oglasna');
                    });
                }
            }

            feri.iconWin.navBarHidden = false;
            feri.navGroup.open(feri.iconWin, {
                animated: true
            });
        });
        return view;
    };

	// Layout the dashboard icons
    for (i = 0; i < feri.ui.icons.list.length; i++) {
        viewIcons.add(createIcon(feri.ui.icons.list[i]));
    }

    if (feri.isAndroid()) {
        mainWindow.open({
            animated: true
        });
    } else {
        navWindow.open({
            transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN
        });
    }

    // Handle sessions and speaker updates
    var updateCount = 0;
    Ti.addEventListener('drupal:entity:datastore:update_completed', function (e) {
        updateCount++;
        if (updateCount >= 2) {
            updateCount = 0;
            Ti.App.fireEvent('app:update_people');
            feri.ui.activityIndicator.hideModal();
        }
    });

    Ti.addEventListener('feri:update_data', function (e) {
        feri.ui.activityIndicator.showModal('Loading news and people...', updateTimeout, 'Connection timed out. All session and speaker data may not have updated.');
        updateCount = 0;
        Drupal.entity.db('main', 'node').fetchUpdates('session');
        Drupal.entity.db('main', 'user').fetchUpdates('user');
        //Drupal.entity.db('main', 'board_parents').fetchUpdates('board_parents');
    });
    
    Ti.addEventListener('feri:flip_oglasna', function (e) {
    	if ( Titanium.App.Properties.getString('boardLatest') == 'latest' ) {
    		feri.oglasnaTableView.animate({view:feri.tableviewFirst,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT},
    		function () {
    			feri.boardWindow.setTitle(e.table);
    			Titanium.App.Properties.setString('boardLatest','category');
    			feri.boardWindow.setTitle('Oglasna deska');
    		});
    	} else {
			feri.oglasnaTableView.animate({view:feri.tableview,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT},
			function () {
    			feri.boardWindow.setTitle(e.table);
    			Titanium.App.Properties.setString('boardLatest','latest');
    			feri.boardWindow.setTitle('Zadnja obvestila');
    		});    		
    	}
    });
    
    Ti.addEventListener('feri:fix_tables', function (e) {
        Drupal.entity.db('main', 'board_parents').fixTables('board_parents');
        Drupal.entity.db('main', 'board_children').fixTables('board_children');
    });
    
    Ti.Gesture.addEventListener('shake',function(e) {
		Ti.fireEvent('feri:update_data');
		Ti.fireEvent('feri:fix_tables');
	});
})();