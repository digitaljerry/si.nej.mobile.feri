
(function () {
	
	function getNodeCat(parent) {
		
		var where = "parent = 0 OR parent = -1";
		if ( parent != undefined )
			where = "parent = " + parent;
		
		var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT uid FROM node_cat WHERE "+where+" ORDER BY uid DESC");
        var uids = [];
		
        while (rows.isValidRow()) {
            uids.push(rows.fieldByName('uid'));
            rows.next();
        }
        rows.close();
        
        // Create session rows
		var nodes = Drupal.entity.db('main', 'node_cat').loadMultiple(uids, ['uid'], false);
		
		return nodes;
	}

    feri.ui.createBoardCatWindow = function (w) {
        
        // create main day window
        var boardWindow = Titanium.UI.createWindow({
            id: 'win1',
            title: w.title,
            backgroundColor: '#fff',
            barColor: '#414444',
            fullscreen: false
        });
        
        // OGLASNA DESKA
        
        var data2 = [];
        
        var oglasnaDeskaTable = 'tableview';
        var tableview = feri.ui.createBoardCatTable(w);
        
        // oglasna deska click handler
        tableview.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				feri.navGroup.open(feri.ui.createBoardCatWindow({
		    		title: e.rowData.favTitle,
		    		uid: e.rowData.uid
		    	}), {
		    		animated: true
		    	});
            }
        });
        
        boardWindow.add(tableview);

        return boardWindow;
    };
    
    // cat window
    feri.ui.createBoardCatTable = function(w) {
    	
    	// OGLASNA DESKA
        
        var data2 = [];
        
        var favs;
        if ( w != undefined)
        	favs = getNodeCat(w.uid);
        else
        	favs = getNodeCat();
        
		for (var favNum = 0, numFavs = favs.length; favNum < numFavs; favNum++) {
            var fav = favs[favNum];
            var favTitle = feri.cleanSpecialChars(fav.title);
            var favRow = Ti.UI.createTableViewRow({
                hasChild: true,
                className: 'cs_fav',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                uid: fav.uid,
                favTitle: favTitle,
                height: 'auto',
                layout: 'vertical',
                focusable: true
            });
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var favLabel = Ti.UI.createLabel({
                text: favTitle,
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                left: leftSpace,
                top: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            favRow.add(favLabel);
            
			data2.push(favRow);
        }
        
        // TABLES
        
        var tableview = Titanium.UI.createTableView({
        	data: data2
        });
        
        return tableview;
    };
    
})();