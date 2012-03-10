
(function () {
	
	if (
		Titanium.App.Properties.getString('feri.useDashboard') == 'true' ||
		Titanium.App.Properties.getString('feri.useDashboard') == '' ||
		Titanium.App.Properties.getString('feri.useDashboard') == 'undefined' ||
		feri.isAndroid()
	)	{
		feri.useDashboard = true;
	} else {
		feri.useDashboard = false;
	}
	
	if ( feri.useDashboard ) {
		
		var i = 0;
	    var navWindow;
	    var mainWindow = Ti.UI.createWindow({
	        backgroundImage: feri.ui.mainBackgroundImage,
	        title: 'Dashboard',
	        navBarHidden: true,
	        exitOnClose: true
	    });
	    var viewIcons = Ti.UI.createView({
	        height: feri.ui.dashboardHeight,
	        width: feri.ui.dashboardWidth,
	        bottom: 20,
	        borderRadius: 0,
	        layout: 'horizontal'
	    });
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
	        	
	        	// preventing clicks on the dashboard after some icon was already clicked
	        	if ( feri.dashboardActive == false )
	        		return;
	        	else
	        		feri.dashboardActive = false;
	        	
	        	// feedback on the icon when clicked 
	        	icon.imageActive = 'undefined';
	        	view.backgroundImage = icon.imageActive;
	        	
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
	                    // re-enabling the icons on the dashboard
	                    feri.dashboardActive = true;
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
	                                	if ( icon.func == 'feri.ui.createBoardWindow' )
	                                    	Ti.fireEvent('feri:update_data_oglasna');
	                                    else if ( icon.func == 'feri.ui.createPeopleWindow' )
	                                    	Ti.fireEvent('feri:update_data_zaposleni');
	                                    else if ( icon.func == 'feri.ui.createDiplomeWindow' )
	                                    	Ti.fireEvent('feri:update_data_diplome');
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
	
	            feri.iconWin.navBarHidden = false;
	            feri.navGroup.open(feri.iconWin, {
	                animated: true
	            });
	            
	            // bring the icon back
	            view.backgroundImage = icon.image;
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
		
	} else {
		
		var imageSuffix = '';
		if (feri.isLargeScreen()) {
			imageSuffix = '@2x';
		}
		
		// create tab group
		var tabGroup = Titanium.UI.createTabGroup({
				barColor: '#004586',
				allowUserCustomization: false
		});
		
		var winOglasna = feri.ui.createBoardWindow();
		feri.tabOglasna = Titanium.UI.createTab({  
		    icon:'images/dashboard/oglasnaTab' + imageSuffix + '.png',
		    title:'Oglasna',
		    window:winOglasna
		});
		feri.tabUrniki = Titanium.UI.createTab({  
		    icon:'images/dashboard/urnikiTab' + imageSuffix + '.png',
		    title:'Urniki',
		    window:feri.ui.createUrnikiWindow()
		});
		var winZaposleni = feri.ui.createPeopleWindow();
		feri.tabPeople = Titanium.UI.createTab({  
		    icon:'images/dashboard/zaposleniTab' + imageSuffix + '.png',
		    title:'Zaposleni',
		    window:winZaposleni
		});
		feri.tabMap = Titanium.UI.createTab({  
		    icon:'images/dashboard/zemljevidTab' + imageSuffix + '.png',
		    title:'Zemljevid',
		    window:feri.ui.createMapWindow()
		});
		var winDiplome = feri.ui.createDiplomeWindow();
		feri.tabDiplome = Titanium.UI.createTab({  
		    icon:'images/dashboard/diplomeTab' + imageSuffix + '.png',
		    title:'Diplome',
		    window:winDiplome
		});
		feri.tabInformacije = Titanium.UI.createTab({  
		    icon:'images/dashboard/informacijeTab' + imageSuffix + '.png',
		    title:'Informacije',
		    window:feri.ui.createInformacijeWindow()
		});
		feri.tabNastavitve = Titanium.UI.createTab({  
		    icon:'images/dashboard/nastavitveTab' + imageSuffix + '.png',
		    title:'Nastavitve',
		    window:feri.ui.createNastavitveWindow()
		});
		feri.tabAbout = Titanium.UI.createTab({  
		    icon:'images/dashboard/aboutTab' + imageSuffix + '.png',
		    title:'FERI',
		    window:feri.ui.createAboutWindow()
		});
		
		// refresh buttons
		var rightButtonOglasna = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        });
        winOglasna.rightNavButton = rightButtonOglasna;
        rightButtonOglasna.addEventListener('click', function () {
            Ti.fireEvent('feri:update_data_oglasna');
        });
        var rightButtonDiplome = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        });
        winDiplome.rightNavButton = rightButtonDiplome;
        rightButtonDiplome.addEventListener('click', function () {
            Ti.fireEvent('feri:update_data_diplome');
        });
        var rightButtonZaposleni = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        });
        winZaposleni.rightNavButton = rightButtonZaposleni;
        rightButtonZaposleni.addEventListener('click', function () {
            Ti.fireEvent('feri:update_data_zaposleni');
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

    Ti.addEventListener('feri:update_data', function (e) {
        feri.ui.activityIndicator.showModal('Posodabljam ...', feri.updateTimeout, 'Napaka pri povezavi.');
        Database.entity.db('main', 'user').fetchUpdates('user');
        Database.entity.db('main', 'node').fetchUpdates('node');
        Database.entity.db('main', 'aktualne_diplome').fetchUpdates('aktualne_diplome');
        Database.entity.db('main', 'zadnje_diplome').fetchUpdates('zadnje_diplome');
    });
    
    Ti.addEventListener('feri:update_data_oglasna', function (e) {
        feri.ui.activityIndicator.showModal('Posodabljam ...', feri.updateTimeout, 'Napaka pri povezavi.');
        Database.entity.db('main', 'node').fetchUpdates('node');
    });
    
    Ti.addEventListener('feri:update_data_diplome', function (e) {
        feri.ui.activityIndicator.showModal('Posodabljam ...', feri.updateTimeout, 'Napaka pri povezavi.');
        Database.entity.db('main', 'aktualne_diplome').fetchUpdates('aktualne_diplome');
        Database.entity.db('main', 'zadnje_diplome').fetchUpdates('zadnje_diplome');
    });
    
    Ti.addEventListener('feri:update_data_zaposleni', function (e) {
        feri.ui.activityIndicator.showModal('Posodabljam ...', feri.updateTimeout, 'Napaka pri povezavi.');
        Database.entity.db('main', 'user').fetchUpdates('user');
    });
    
    Ti.addEventListener('feri:flip_oglasna', function (e) {
    	if ( Titanium.App.Properties.getString('boardLatest') == 'category' ) {
    		
    		feri.tableview.show();
    		feri.tableviewFirst.hide();
    		
    		Titanium.App.Properties.setString('boardLatest','latest');
    		feri.boardWindow.setTitle('Aktualno');
    		
    	} else {
    		
    		feri.tableviewFirst.show();
    		feri.tableview.hide();
    		
			Titanium.App.Properties.setString('boardLatest','category');
    		feri.boardWindow.setTitle('Deska');
    		
    	}
    });
    
    Ti.addEventListener('feri:fix_tables', function (e) {
        Database.entity.db('main', 'board_parents').fixTables('board_parents');
        Database.entity.db('main', 'board_children').fixTables('board_children');
        Database.entity.db('main', 'aktualne_diplome').fixTables('aktualne_diplome');
        Database.entity.db('main', 'zadnje_diplome').fixTables('zadnje_diplome');
        Database.entity.db('main', 'user').fixTables('user');
    });
    
    if (
    	Titanium.App.Properties.getString('feri.refreshOnShake') == '' ||
    	Titanium.App.Properties.getString('feri.refreshOnShake') == 'undefined'
    ) {
    	Titanium.App.Properties.setString('feri.refreshOnShake', 'true');
    }
    
    if (
    	Titanium.App.Properties.getString('feri.useDashboard') == '' ||
    	Titanium.App.Properties.getString('feri.useDashboard') == 'undefined'
    ) {
    	Titanium.App.Properties.setString('feri.useDashboard', 'true');
    }
    	
    Ti.Gesture.addEventListener('shake',function(e) {
		if ( Titanium.App.Properties.getString('feri.refreshOnShake') == 'true' ) {
			Ti.fireEvent('feri:update_data_oglasna');
			//Ti.fireEvent('feri:fix_tables');
		}
	});
	
	// check if we need to reload data on load
	if ( Titanium.App.Properties.getString('feri.refreshOnLoad') == 'true' ) {
		Ti.fireEvent('feri:update_data_oglasna');
	}
	
})();