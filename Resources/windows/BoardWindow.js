
(function () {
	
	feri.ui.createBoardWindow = function (w) {
        // Base row properties
        var baseRow = {
            hasChild: true,
            color: '#000',
            backgroundColor: '#fff',
            font: {
                fontWeight: 'bold'
            }
        };
        baseRow[feri.ui.backgroundSelectedProperty + 'Color'] = feri.ui.backgroundSelectedColor;
        
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
            id: 'win1',
            title: 'Zadnja obvestila',
            backgroundColor: '#fff',
            barColor: '#414444',
            fullscreen: false
        });
        
        // if we have the title from a category
        if ( w != undefined ) {
        	// set the title
        	feri.boardWindow.title = w.title;
        	
        	// add a header
        	var headerRow = Ti.UI.createTableViewRow({
	            height: 'auto',
	            left: 0,
	            top: -5,
	            bottom: 10,
	            layout: 'vertical',
	            className: 'mainHeaderRow',
	            backgroundPosition: 'bottom left',
	            selectionStyle: 'none'
	        });
	        
	        var titleLabel = Ti.UI.createLabel({
                text: feri.cleanSpecialChars(w.title),
                font: {
                    fontSize: 28,
                    fontWeight: 'bold'
                },
                textAlign: 'left',
                color: '#000',
                left: commonPadding,
                top: 18,
                bottom: 7,
                right: commonPadding,
                height: 'auto'
            });
            
            // sql check
            var rows = Drupal.entity.db('main', 'board_parents').execute('SELECT * FROM board_parents WHERE uid = ' + w.category);
			Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
			
			/*while (rows.isValidRow())
			{
				Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name'));
				rows.next();
			}
			rows.close();*/
			
            if ( w.prevtitle != undefined ) {
            	var subtitleLabel = Ti.UI.createLabel({
	                text: feri.cleanSpecialChars(w.title),
	                font: {
	                    fontSize: 18,
	                    fontWeight: 'normal'
	                },
	                textAlign: 'left',
	                color: '#000',
	                left: commonPadding,
	                top: 'auto',
	                bottom: 5,
	                right: 'auto',
	                height: 'auto'
	            });
	            titleLabel.text = feri.cleanSpecialChars(w.prevtitle);
	            
	            headerRow.add(titleLabel);
	            headerRow.add(subtitleLabel);	
            }
            
            data.push(headerRow);
            data.push(feri.ui.createHeaderRow('Nastavitve'));
            
            // do the priljubljene row
            var favRow = Ti.UI.createTableViewRow({height:45});
            var favLabel = Ti.UI.createLabel({
                text: 'Priljubljene',
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                top: 10,
                left: 10,
                height: 'auto'
            });
            var favSwitch = Ti.UI.createSwitch({
				value:false,
				right:10,
				top:10
			});
			favRow.add(favLabel);
			favRow.add(favSwitch);
			data.push(favRow);
			
			var pushRow = Ti.UI.createTableViewRow({height:45});
            var pushLabel = Ti.UI.createLabel({
                text: 'Push obvestila',
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                top: 10,
                left: 10,
                height: 'auto'
            });
            var pushSwitch = Ti.UI.createSwitch({
				value:false,
				right:10,
				top:10
			});
			pushRow.add(pushLabel);
			pushRow.add(pushSwitch);
			data.push(pushRow);
            
            // do the push row
        }
        
        // ZADNJA OBVESTILA
		
        var conn = Drupal.db.getConnection('main');
        
        var where = "";
		if ( w != undefined )
			where = "WHERE category = " + w.category;
        
        var rows = conn.query("SELECT nid FROM node "+where+" ORDER BY nid DESC");
        Ti.API.debug("SELECT nid FROM node "+where+" ORDER BY nid DESC");
        
        var nids = [];

        while (rows.isValidRow()) {
            nids.push(rows.fieldByName('nid'));
            rows.next();
        }
        rows.close();

		// Create session rows
		var lastDate = '';
        var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['nid'], false);
        for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
            var session = sessions[sessionNum];
            var sessionTitle = feri.cleanSpecialChars(session.title);
            var sessionRow = Ti.UI.createTableViewRow({
                hasChild: true,
                className: 'cs_session',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                date: session.date,
                nid: session.nid,
                sessionTitle: sessionTitle,
                height: 'auto',
                layout: 'vertical',
                focusable: true
            });
			sessionRow[feri.ui.backgroundSelectedProperty + 'Color'] = feri.ui.backgroundSelectedColor;

            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            // If there is a new session time, insert a header in the table.
            var headerRow = undefined;
            if (lastDate == '' || session.date != lastDate) {
                lastDate = session.date;
                headerRow = feri.ui.createHeaderRow(lastDate);
            }

            var titleLabel = Ti.UI.createLabel({
                text: sessionTitle,
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                color: titleColor,
                left: leftSpace,
                top: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            // Some sessions have multiple people
            var authorLabel = Ti.UI.createLabel({
                text: session.author,
                font: {
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                color: '#000',
                left: leftSpace,
                top: 4,
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            sessionRow.add(titleLabel);
            sessionRow.add(authorLabel);

			if (headerRow) {
				data.push(headerRow);	
			}
			data.push(sessionRow);
        }
        
        // TABLES
        feri.tableview = Titanium.UI.createTableView({
            data: data
        });
        
        feri.tableview2 = feri.ui.createBoardCatTable(undefined, false);
        
        // choose if show latest or categorized view
        if (!Titanium.App.Properties.getString('boardLatest')) {
			Titanium.App.Properties.setString('boardLatest','latest');
		}
		
		// if user has set oglasna deska as default view do thise
		if (Titanium.App.Properties.getString('boardLatest') == 'latest') {
			feri.oglasnaTableView.add(feri.tableview);
		} else {
			feri.oglasnaTableView.add(feri.tableview2);
		}
        
        // zadnje objave click handler
        feri.tableview.addEventListener('click', function (e) {
			if (e.rowData.nid) {
                feri.navGroup.open(feri.ui.createBoardDetailWindow({
                    title: e.rowData.sessionTitle,
                    nid: e.rowData.nid
                }), {
                    animated: true
                });
            }
        });
        
        // oglasna deska click handler
        feri.tableview2.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				alert(e.rowData.kind);
				/*if (e.rowData.isLeaf == true) {
					feri.navGroup.open(feri.ui.createBoardWindow({
	                    title: e.rowData.favTitle,
	                    category: e.rowData.uid
	                }), {
	                    animated: true
	                });
				} else {*/
					feri.navGroup.open(feri.ui.createBoardCatWindow({
			    		title: e.rowData.favTitle,
			    		uid: e.rowData.uid
			    	}), {
			    		animated: true
			    	});
				//}
            }
        });
		
		feri.boardWindow.add(feri.oglasnaTableView);

        return feri.boardWindow;
    };
    
})();