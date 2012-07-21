
(function () {

    feri.ui.createNastavitveWindow = function () {
    	
    	if ( feri.testflight == true && !feri.isAndroid() ) {
			testflight.passCheckpoint("Nastavitve window");	
		}
    	
        var NastavitveWindow = Titanium.UI.createWindow({
            id: 'nastavitveWindow',
            title: 'Nastavitve',
            backgroundColor: '#FFF',
            barColor: feri.ui.barColor,
            fullscreen: false
        });
        
        // Create the table view
        if ( !feri.isAndroid() ) {
        	var inputData = [
				{title:'Dashboard', switchAppUse: 'dashboard', header:'Oblika'},
				{title:'Zavihki', switchAppUse: 'tabs'}
			];
			
			if ( feri.useDashboard == true )
				inputData[0].hasCheck = true;
			else
				inputData[1].hasCheck = true;
        } else {
        	var inputData = [];
        }
		
		var row1 = Ti.UI.createTableViewRow({
			height:50,
			title:'Shake to reload',
			color: feri.ui.darkText,
			header:'Oglasna deska',
			refreshOnShake:true
		});
		
		if ( feri.isAndroid() ) {
			var titleLabel1 = Ti.UI.createLabel({
	            text: 'Shake to reload',
	            font: {
	                fontSize: 16,
	                fontWeight: 'bold'
	            },
	            color: feri.ui.darkText,
	            left: 10,
	            top: 10,
	            bottom: 10,
	            right: 10,
	            height: 'auto',
	        });
	        row1.add(titleLabel1);
		}
		
		var sw1 = Ti.UI.createSwitch({
			right:10,
			value:false
		});
		var row2 = Ti.UI.createTableViewRow({
			height:50,
			title:'Osveži ob zagonu',
			refreshOnLoad:true
		});
		var row3 = Ti.UI.createTableViewRow({
			height:50,
			title:'Priljubljene',
			editList:'favorites',
			hasChild: true
		});
		var row4 = Ti.UI.createTableViewRow({
			height:50,
			title:'Push obvestila',
			editList:'push',
			hasChild: true
		});
		
		if ( feri.isAndroid() ) {
			var titleLabel2 = Ti.UI.createLabel({
	            text: 'Osveži ob zagonu',
	            font: {
	                fontSize: 16,
	                fontWeight: 'bold'
	            },
	            color: feri.ui.darkText,
	            left: 10,
	            top: 10,
	            bottom: 10,
	            right: 10,
	            height: 'auto',
	        });
	        row2.add(titleLabel2);
	        
	        var titleLabel3 = Ti.UI.createLabel({
	            text: 'Priljubljene',
	            font: {
	                fontSize: 16,
	                fontWeight: 'bold'
	            },
	            color: feri.ui.darkText,
	            left: 10,
	            top: 10,
	            bottom: 10,
	            right: 10,
	            height: 'auto',
	        });
	        row3.add(titleLabel3);
	        
	        var titleLabel4 = Ti.UI.createLabel({
	            text: 'Push obvestila',
	            font: {
	                fontSize: 16,
	                fontWeight: 'bold'
	            },
	            color: feri.ui.darkText,
	            left: 10,
	            top: 10,
	            bottom: 10,
	            right: 10,
	            height: 'auto',
	        });
	        row4.add(titleLabel4);
		}
		var sw2 = Ti.UI.createSwitch({
			right:10,
			value:false
		});
		
		if ( Titanium.App.Properties.getString('feri.refreshOnShake') == 'true' )
			sw1.value = true;
		if ( Titanium.App.Properties.getString('feri.refreshOnLoad') == 'true' )
			sw2.value = true;
	
		row1.add(sw1);
		row2.add(sw2);
		
		inputData.push(row1);
		inputData.push(row2);
		inputData.push(row3);
		inputData.push(row4);
		
		var oglasnaDeskaSettings = [
			{title:'Priljubljene', editList: 'favorites', header:'Oglasna deska'},
			{title:'Push obvestila', editList: 'push'}
		];
		
		inputData.push(oglasnaDeskaSettings);
		
		if ( feri.testflight == true && !feri.isAndroid() ) {
			var row99 = Ti.UI.createTableViewRow({
				height:50,
				title:'Pošlji feedback',
				feedback:true,
				hasChild: true,
				header:'Samo v beta verziji'
			});
			inputData.push(row99);
		}
		
		var tableView = Titanium.UI.createTableView({
			data:inputData
		});
		
		if ( !feri.isAndroid() )
			tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;

        // create table view event listener
        tableView.addEventListener('click', function (e) {
			
			var section = e.section;
			
			// app use switch
			if ( e.rowData.switchAppUse ) {
				if ( e.rowData.switchAppUse == 'dashboard' && feri.useDashboard == false) {
					section.rows[0].hasCheck = true;
					section.rows[1].hasCheck = false;
					Titanium.App.Properties.setString('feri.mainView', 'dashboard');
					feri.useDashboard = true;
					feri.dashboardActive = true;
					Ti.include('windows/main.js');
				} else if ( e.rowData.switchAppUse == 'tabs' && feri.useDashboard == true) {
					section.rows[0].hasCheck = false;
					section.rows[1].hasCheck = true;
					Titanium.App.Properties.setString('feri.mainView', 'tabs');
					feri.useDashboard = false;
					feri.dashboardActive = true;
					feri.ui.activityIndicator.showModal('Posodabljam ...');
					Ti.include('windows/main.js');
				}
			}
			
			if ( e.rowData.editList == 'favorites' ) {
				
				if (feri.useDashboard) {
					feri.navGroup.open(feri.ui.createNastavitveBoardEditListWindow({
						title: 'Priljubljene',
	                    edit: e.rowData.editList
	                }), {
	                    animated: true
	                });
	            } else {
	            	feri.tabOglasna.open(feri.ui.createNastavitveBoardEditListWindow({
	            		title: 'Priljubljene',
	                    edit: e.rowData.editList
	                }),{animated:true});
	            }
	            
	        } else if ( e.rowData.editList == 'push' ) {
				
				if (feri.useDashboard) {
					feri.navGroup.open(feri.ui.createNastavitveBoardEditListWindow({
						title: 'Push obvestila',
	                    edit: e.rowData.editList
	                }), {
	                    animated: true
	                });
	            } else {
	            	feri.tabOglasna.open(feri.ui.createNastavitveBoardEditListWindow({
	            		title: 'Push obvestila',
	                    edit: e.rowData.editList
	                }),{animated:true});
	            }
	            
	        }
	        
	        if ( feri.testflight == true && !feri.isAndroid() && e.rowData.feedback == true ) {
		        Ti.API.warn("Open Feedback View");
		        testflight.openFeedbackView();
			}
			
		});
		
		sw1.addEventListener('change',function(e) {
			if ( e.value )
				Titanium.App.Properties.setString('feri.refreshOnShake', 'true');
			else
				Titanium.App.Properties.setString('feri.refreshOnShake', 'false');
		});
		
		sw2.addEventListener('change',function(e) {
			if ( e.value )
				Titanium.App.Properties.setString('feri.refreshOnLoad', 'true');
			else
				Titanium.App.Properties.setString('feri.refreshOnLoad', 'false');
		});
				
		// add table view to the window
        NastavitveWindow.add(tableView);
		
		// android back button listener
		if (feri.isAndroid()) {
			NastavitveWindow.addEventListener('android:back',function(){
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
		}
		
        return NastavitveWindow;
    };

})();