
(function () {
	
	feri.ui.createBoardWindow = function (w) {
		
		var conn = Drupal.db.getConnection('main');
        
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
        
        //////////////////////
        // ZADNJA OBVESTILA //
        //////////////////////
		
        data = feri.ui.getBoardData();
        
        // TABLES
        feri.tableview = Titanium.UI.createTableView({
            data: data,
            filterAttribute:'search'
        });
        
        // make it searchable
        feri.getSearchbar(feri.tableview);
        
        feri.tableviewFirst = feri.ui.createBoardCatTable(undefined, true);
        
        	// choose if show latest or categorized view
        if (!Titanium.App.Properties.getString('boardLatest')) {
			Titanium.App.Properties.setString('boardLatest','latest');
		}
		
		// if user has set oglasna deska as default view do thise
		if (Titanium.App.Properties.getString('boardLatest') == 'latest') {
			feri.oglasnaTableView.add(feri.tableview);
		} else {
			feri.oglasnaTableView.add(feri.tableviewFirst);
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
        feri.tableviewFirst.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				if (e.rowData.hasChild == true) {
					feri.navGroup.open(feri.ui.createBoardCatDetailWindow({
	                    title: e.rowData.catTitle,
	                    category: e.rowData.uid
	                }), {
	                    animated: true
	                });
				} else {
					feri.navGroup.open(feri.ui.createBoardCatWindow({
			    		title: e.rowData.catTitle,
			    		uid: e.rowData.uid
			    	}), {
			    		animated: true
			    	});
				}
            }
        });
		
		feri.boardWindow.add(feri.oglasnaTableView);

        return feri.boardWindow;
    };
    
    feri.ui.getBoardData = function (catUid) {
		
		var data = [];
		
		var where = "";
		if ( catUid != undefined )
			where = "WHERE category = " + catUid;
        
        var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT nid FROM node "+where+" ORDER BY nid DESC LIMIT 25");
        Ti.API.debug("SELECT nid FROM node "+where+" ORDER BY nid DESC LIMIT 25");
        
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
                focusable: true,
                search: sessionTitle
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
                bottom: 10,
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
        
        return data;
	};
    
})();