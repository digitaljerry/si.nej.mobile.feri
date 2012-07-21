
(function () {
	
	feri.ui.createBoardCatDetailWindow = function (w) {
		
		if ( feri.testflight == true && !feri.isAndroid() ) {
			testflight.passCheckpoint("Board Category Detail window");	
		}
		
		var conn = Database.db.getConnection('main');
		
		// getting entity from db
		var catData = Database.entity.db('main', 'board_children').load(w.category);
		
		var catTitle = w.title.split(',')[0];
        
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
        
        // create main day window
        var boardDetailWindow = Titanium.UI.createWindow({
            id: 'boardCatDetailWindow',
            title: catTitle,
            barColor: feri.ui.barColor,
            backgroundColor: feri.ui.backgroundColor,
            fullscreen: false
        });
        
        // add a header
    	var headerRow = Ti.UI.createTableViewRow({
            left: 10,
            top: 10,
            layout: 'vertical',
            className: 'mainHeaderRow',
            backgroundPosition: 'bottom left',
            selectionStyle: 'none',
            selectedBackgroundColor: feri.ui.selectedBackgroundColor
        });
        
        var titleLabel = Ti.UI.createLabel({
            text: feri.cleanSpecialChars(catTitle),
            font: {
                fontSize: 28,
                fontWeight: 'bold'
            },
            textAlign: 'left',
            color: feri.ui.darkText,
            left: commonPadding,
            top: 18,
            bottom: 10,
            right: commonPadding,
            height: 'auto'
        });
        
        headerRow.add(titleLabel);
        
        // if we have a category that starts with number
        // we need to get it's parent
        if ( feri.is_int(w.title[0]) ) {
        	var rows = conn.query("SELECT parent FROM board_children WHERE uid = " + w.category);
        	var parentUid = rows.fieldByName('parent');
        	
        	var rows = conn.query("SELECT title FROM board_parents WHERE uid = " + parentUid);
        	var titleLabelDetail = rows.fieldByName('title');
        	rows.close();
        	
        	var addTitleLabel = Ti.UI.createLabel({
	            text: feri.cleanSpecialChars(titleLabelDetail),
	            font: {
	                fontSize: 20,
	                fontWeight: 'bold'
	            },
	            textAlign: 'left',
	            color: feri.ui.darkText,
	            left: commonPadding,
	            top: 0,
	            bottom: 10,
	            right: commonPadding,
	            height: 'auto'
	        });
	        
	        headerRow.add(addTitleLabel);
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
		
		// here
		if (catData.favourite)
			favSwitch.value = true;
		if (catData.push)
			pushSwitch.value = true;
		
		// add obvestila
		data = data.concat(feri.ui.getBoardData(w.category));
        
        var tableview = Titanium.UI.createTableView({
        	data: data
        });
        
		// zadnje objave click handler
        tableview.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				if (feri.useDashboard) {
	                feri.navGroup.open(feri.ui.createBoardDetailWindow({
	                    title: e.rowData.sessionTitle,
	                    uid: e.rowData.uid
	                }), {
	                    animated: true
	                });
	            } else {
	            	feri.tabOglasna.open(feri.ui.createBoardDetailWindow({
	                    title: e.rowData.sessionTitle,
	                    uid: e.rowData.uid
	                }),{animated:true});
	            }
            }
        });
        
        // switch click listeners
        favSwitch.addEventListener('change', function (e) {
        	if (e.value == true)
        		catData.favourite = true;
        	else
        		catData.favourite = false;
        	
        	// save with force remove
        	Database.entity.db('main', 'board_children').save(catData, true);
        	
        	// update the initial table
        	feri.tableviewFirst.setData(feri.ui.getBoardCatTableData(undefined, true));
        });
        
        // switch click listeners
        pushSwitch.addEventListener('change', function (e) {
        	if (e.value == true) {
        		catData.push = true;
        		feri.subscribeToServerPush(catData.uid);
        	}
        	else
        	{
        		catData.push = false;
        		feri.unsubscribeToServerPush(catData.uid);
        	}
        	
        	// save with force remove
        	Database.entity.db('main', 'board_children').save(catData, true);
        });
        
        boardDetailWindow.add(tableview);

        return boardDetailWindow;
    };
    
})();