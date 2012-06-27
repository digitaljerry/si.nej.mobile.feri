
(function () {
	
	feri.ui.createBoardWindow = function (w) {
		
		var conn = Database.db.getConnection('main');
        
        // Base row properties
        var baseRow = {
            hasChild: true,
            font: {
                fontWeight: 'bold'
            }
        };
        
        var data = [];
        var commonPadding = 15;

        // Creates a TableViewRow using the base row properties and a given
        // params object
        var createDayRow = function (params) {
            return feri.extend(Ti.UI.createTableViewRow(params), baseRow);
        }
        
        // Create data for TableView
        var data = [];
        
        feri.oglasnaTableView = Titanium.UI.createView({
			height:'100%',
			width:'100%'
		});

        // create main day window
        feri.boardWindow = Titanium.UI.createWindow({
            id: 'boardWindow',
            title: '',
            barColor: feri.ui.barColor,
            backgroundColor: feri.ui.backgroundColor,
            fullscreen: false
        });
        
        // tabbar control
        if ( !feri.isAndroid() ) {
	        var tabbar = Ti.UI.iOS.createTabbedBar({
				labels:['Aktualno', 'Deska'],
				backgroundColor:feri.ui.barColor,
				index: 0,
				style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
				height:30,
				width:200
			});
			feri.boardWindow.setTitleControl(tabbar);
			
			tabbar.addEventListener('click', function(e)
			{
				if ( e.index == 0 )
					Ti.fireEvent('feri:flip_oglasna_aktualno');
				else if ( e.index == 1 )
					Ti.fireEvent('feri:flip_oglasna_deska');
				
			});
		}
        
        //////////////////////
        // ZADNJA OBVESTILA //
        //////////////////////
		
        data = feri.ui.getBoardData();
        Ti.addEventListener('refresh:oglasna', function () {
        	data = feri.ui.getBoardData();
            feri.tableview.setData(data);
        });
        
        // TABLES
        feri.tableview = Titanium.UI.createTableView({
            data: data,
            backgroundColor: feri.ui.backgroundColor,
            filterAttribute:'search'
        });
        
        // make it searchable
        feri.getSearchbar(feri.tableview);
        
        feri.tableviewFirst = feri.ui.createBoardCatTable(undefined, true);
        
        	// choose if show latest or categorized view
        if (!Titanium.App.Properties.getString('boardLatest')) {
			Titanium.App.Properties.setString('boardLatest','latest');
		}
		
		feri.tableview.hide();
		feri.tableviewFirst.hide();
		
		// if user has set oglasna deska as default view do thise
		if (Titanium.App.Properties.getString('boardLatest') == 'latest') {
			//feri.oglasnaTableView.add(feri.tableview);
			feri.tableview.show();
			feri.tableviewFirst.hide();
			feri.boardWindow.title = 'Aktualno';
			
			if ( !feri.isAndroid() )
				tabbar.index = 0;
			
		} else {
			//feri.oglasnaTableView.add(feri.tableviewFirst);
			feri.tableviewFirst.show();
			feri.tableview.hide();
			if ( feri.isAndroid() )
				feri.boardWindow.title = 'Oglasna deska';
			else
				feri.boardWindow.title = 'Deska';
			
			if ( !feri.isAndroid() )
				tabbar.index = 1;
		}
		feri.oglasnaTableView.add(feri.tableview);
		feri.oglasnaTableView.add(feri.tableviewFirst);
        
        // zadnje objave click handler
        feri.tableview.addEventListener('click', function (e) {
			if (e.rowData.uid) {
                
                if (feri.useDashboard) {
                	feri.navGroup.open(feri.ui.createBoardDetailWindow({
                    	title: e.rowData.sessionTitle,
                    	sessionTitle: e.rowData.sessionTitle,
                    	uid: e.rowData.uid
                	}), {
                    	animated: true
                	});
                } else {
                	feri.tabOglasna.open(feri.ui.createBoardDetailWindow({
                    	title: e.rowData.sessionTitle,
                    	sessionTitle: e.rowData.sessionTitle,
                    	uid: e.rowData.uid
                	}),{animated:true});
                }
            }
        });
        
        // oglasna deska click handler
        feri.tableviewFirst.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				if (e.rowData.hasChild == true) {
					
					if (feri.useDashboard) {
						feri.navGroup.open(feri.ui.createBoardCatDetailWindow({
		                    title: e.rowData.catTitle,
		                    category: e.rowData.uid
		                }), {
		                    animated: true
		                });
		            } else {
		            	feri.tabOglasna.open(feri.ui.createBoardCatDetailWindow({
		                    title: e.rowData.catTitle,
		                    category: e.rowData.uid
		                }),{animated:true});
		            }
	                
	                
				} else {
					
					if (feri.useDashboard) {
						feri.navGroup.open(feri.ui.createBoardCatWindow({
				    		title: e.rowData.catTitle,
				    		uid: e.rowData.uid
				    	}), {
				    		animated: true
				    	});
			   		} else {
			   			feri.tabOglasna.open(feri.ui.createBoardCatWindow({
				    		title: e.rowData.catTitle,
				    		uid: e.rowData.uid
				    	}),{animated:true});
			   		}
				}
            }
        });
		
		feri.boardWindow.add(feri.oglasnaTableView);
		
		// android back button listener
		if (feri.isAndroid()) {
			feri.boardWindow.addEventListener('android:back',function(){
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
			
			var activity = feri.boardWindow.activity;
			activity.onCreateOptionsMenu = function(e) {
			    var menu = e.menu;
			    var menuItemRefresh = menu.add({ title: 'Osveži' });
			    menuItemRefresh.addEventListener("click", function(e) {
			        feri.ui.activityIndicator.showModal('Posodabljam ...', feri.updateTimeout, 'Napaka pri povezavi.');
        			Database.entity.db('main', 'node').fetchUpdates('node');
			    });
			    var menuItemAktualno = menu.add({ title: 'Aktualno' });
			    menuItemAktualno.addEventListener("click", function(e) {
			        // fireEvent doesn't work on android ... strange :( 
			        //Ti.fireEvent('feri:flip_oglasna_aktualno');
					feri.boardWindow.setTitle('Aktualno');
			        feri.tableview.show();
					feri.tableviewFirst.hide();
					Titanium.App.Properties.setString('boardLatest','latest');
			    });
			    var menuItemDeska = menu.add({ title: 'Oglasna deska' });
			    menuItemDeska.addEventListener("click", function(e) {
			    	// fireEvent doesn't work on android ... strange :(
			    	//Ti.fireEvent('feri:flip_oglasna_deska');
			    	feri.boardWindow.setTitle('Oglasna deska');
			    	feri.tableviewFirst.show();
					feri.tableview.hide();
					Titanium.App.Properties.setString('boardLatest','category');
			    });
			};
		}

        return feri.boardWindow;
    };
    
    feri.ui.getBoardData = function (catUid) {
		
		var data = [];
		
		var where = "";
		if ( catUid != undefined )
			where = "WHERE category = " + catUid;
        
        var conn = Database.db.getConnection('main');
        var rows = conn.query("SELECT uid FROM node "+where+" ORDER BY uid DESC LIMIT 25");
        
        var uids = [];

        while (rows.isValidRow()) {
            uids.push(rows.fieldByName('uid'));
            rows.next();
        }
        rows.close();
        
		// Create session rows
		var lastDate = '';
        var sessions = Database.entity.db('main', 'node').loadMultiple(uids, ['uid'], false);
        for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
            var session = sessions[sessionNum];
            var sessionTitle = feri.cleanSpecialChars(session.title);
            var sessionRow = Ti.UI.createTableViewRow({
                hasChild: true,
                className: 'cs_session',
                date: session.date,
                uid: session.uid,
                sessionTitle: sessionTitle,
                height: 'auto',
                layout: 'vertical',
                focusable: true,
                search: sessionTitle,
                selectedBackgroundColor: feri.ui.selectedBackgroundColor
            });

            var leftSpace = 10;
            
            // If there is a new session time, insert a header in the table.
            var headerRow = undefined;
            
            var newDate = new Date ( feri.datetime.strtotime(session.date) * 1000 );
            var newDateString = newDate.getMonth() + newDate.getDate();
            
            if (lastDate == '' || newDateString != lastDate) {
                lastDate = newDateString;
                headerRow = feri.ui.createHeaderRow(feri.datetime.shortDate(feri.datetime.strtotime(session.date)));
            }

            var titleLabel = Ti.UI.createLabel({
                text: sessionTitle,
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                color: feri.ui.blueText,
                left: leftSpace,
                top: 10,
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            // details
            /*
            if ( session.author == '' )
            	session.author = 'objavljeno ob' + feri.datetime.cleanTime(session.date);
            else
            	session.author = 'objavljeno ob' + feri.datetime.cleanTime(session.date) + ', ' + session.author;
            */
           
            var authorLabel = Ti.UI.createLabel({
                text: session.author,
                font: {
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                color: feri.ui.darkText,
                left: leftSpace,
                top: 4,
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            sessionRow.add(titleLabel);
            //sessionRow.add(authorLabel);

			if (headerRow) {
				data.push(headerRow);	
			}
			data.push(sessionRow);
        }
        
        if (data.length == 0) {
        	
        	data.push(feri.ui.createHeaderRow('Obvestila'));
        	
        	var sessionRow = Ti.UI.createTableViewRow({
                hasChild: false,
                className: 'cs_session',
                date: '',
                uid: 0,
                height: 'auto',
                layout: 'vertical',
                color: feri.ui.inactiveText,
                focusable: false,
                title: 'Ni obvestil',
                selectedBackgroundColor: feri.ui.selectedBackgroundColor
            });
            
            data.push(sessionRow);
        }
        
        return data;
	};
    
})();