
(function () {

    feri.ui.createBoardWindow = function (tabGroup) {
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

        // Creates a TableViewRow using the base row properties and a given
        // params object
        var createDayRow = function (params) {
            return feri.extend(Ti.UI.createTableViewRow(params), baseRow);
        }

        // Create data for TableView
        var data = [
	        
        ];
        
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
        
        // ZADNJA OBVESTILA
        
        var data = [];
        var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT nid FROM node ORDER BY nid DESC");
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
        
        // OGLASNA DESKA
        
        feri.tableview = Titanium.UI.createTableView({
            data: data
        });
        feri.tableview2 = Titanium.UI.createTableView();
        
        feri.oglasnaTableView.add(feri.tableview2);
        feri.oglasnaTableView.add(feri.tableview);
        
        feri.oglasnaDeskaTable = 'tableview';
        
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
        
        feri.boardWindow.add(feri.oglasnaTableView);

        return feri.boardWindow;
    };
})();