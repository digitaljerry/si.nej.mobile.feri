
(function () {
	
	function getNodeCat(parent) {
		
		var where = "parent = 0";
		if ( parent != undefined ) {
			if ( parent == '-1' )
				where = "favourite = 1";
			else
				where = "parent = " + parent;	
		}
		
		var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT uid FROM board_categories WHERE "+where+"");
        var uids = [];
		
        while (rows.isValidRow()) {
            uids.push(rows.fieldByName('uid'));
            rows.next();
        }
        rows.close();
        
        // Create session rows
        var nodes = Drupal.entity.db('main', 'board_categories').loadMultiple(uids, ['uid,kind'], false);
		
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
    	var oglasnaDeskaTable = 'tableview';
        var tableview = feri.ui.createBoardCatTable(w);
        
        // oglasna deska click handler
        tableview.addEventListener('click', function (e) {
			if (e.rowData.uid) {
				if (e.rowData.isLeaf == true) {
					feri.navGroup.open(feri.ui.createBoardWindow({
	                    title: e.rowData.catTitle,
	                    category: e.rowData.uid
	                }), {
	                    animated: true
	                });
				} else {
					feri.navGroup.open(feri.ui.createBoardCatWindow({
			    		title: e.rowData.catTitle,
			    		uid: e.rowData.uid,
			    		leaf: e.rowData.isLeaf
			    	}), {
			    		animated: true
			    	});
				}
            }
        });
        
        boardWindow.add(tableview);
		
        return boardWindow;
    };
    
    // cat window
    feri.ui.createBoardCatTable = function(w, addFavRows) {
    	
    	var data2 = [];
    	
    	if( addFavRows == true ) {
    		// add the favourites
	        data2.push(feri.ui.createHeaderRow('Priljubljene'));
	        
	        var favs = getNodeCat('-1');
	        for (var favNum = 0, numFavs = favs.length; favNum < numFavs; favNum++) {
	            var fav = favs[favNum];
	            var favTitle = feri.cleanSpecialChars(fav.title);
	            var favRow = Ti.UI.createTableViewRow({
	                className: 'cs_fav',
	                selectedColor: '#000',
	                backgroundColor: '#fff',
	                color: '#000',
	                uid: fav.uid,
	                catTitle: favTitle,
	                height: 'auto',
	                layout: 'vertical',
	                focusable: true
	            });
	            
	            if ( fav.kind == 'node' ) {
	            	favRow.hasChild = true;
	            	favRow.isLeaf = false;
	            } else {
	            	favRow.hasDetail = true;
	            	favRow.isLeaf = true;
	            }
				
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
	        
	        data2.push(feri.ui.createHeaderRow('Kategorije'));
    	}
    	
    	// OGLASNA DESKA
        var cats;
        /*if ( w != undefined)
        	cats = getNodeCat(w.uid);
        else
        	cats = getNodeCat();*/
        Ti.API.debug('---');
        cats = getNodeCat();
        
		for (var catNum = 0, numCats = cats.length; catNum < numCats; catNum++) {
            var cat = cats[catNum];
            var catTitle = feri.cleanSpecialChars(cat.title);
            var catRow = Ti.UI.createTableViewRow({
                className: 'cs_cat',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                uid: cat.uid,
                catTitle: catTitle,
                height: 'auto',
                layout: 'vertical',
                focusable: true
            });
            
            if ( cat.kind == 'node' ) {
            	catRow.hasChild = true;
            	catRow.isLeaf = false;
            } else {
            	catRow.hasDetail = true;
            	catRow.isLeaf = true;
            }
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var catLabel = Ti.UI.createLabel({
                text: catTitle,
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

            catRow.add(catLabel);
            
			data2.push(catRow);
        }
        Ti.API.debug('+++');
        // TABLES
        var tableview = Titanium.UI.createTableView({
        	data: data2
        });
        
        return tableview;
    };
    
})();