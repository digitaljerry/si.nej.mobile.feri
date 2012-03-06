
(function () {
	
	/**
	 * Returns the nodes
	 * 
	 */
	function getNodeCat(parent, includesParents, onlyFavs, getAll) {
		
		var where = '';
		
		if ( parent != undefined )
			where = ' WHERE parent = ' + parent;
		if ( parent == false )
			where = ' WHERE parent = 0';
		
		if ( includesParents == undefined )
			includesParents = false;
		
		if ( onlyFavs == undefined )
			onlyFavs = false;
		if ( onlyFavs == true )
			where = ' WHERE favourite = 1';
		
		if ( getAll == undefined )
			getAll = false;
		if ( getAll == true )
			where = '';
		
		var conn = Database.db.getConnection('main');
		
		var uids = [];
		var uids2 = [];
		var nodes1 = [];
		var nodes2 = [];
		
		// PARENTS (only if we're not fetching favorites')
		if ( includesParents == true ) {
			var rows = conn.query("SELECT uid FROM board_parents" + where);
			
	        while (rows.isValidRow()) {
	            uids.push(rows.fieldByName('uid'));
	            rows.next();
	        }
	        rows.close();
	        
	        // Create session rows
	        nodes1 = Database.entity.db('main', 'board_parents').loadMultiple(uids, ['title'], true);
	        for (var num = 0, numNodes = nodes1.length; num < numNodes; num++) {
	        	nodes1[num].kind = 'leaf';
        	}
        }  
        
        // CHILDREN
        var rows2 = conn.query("SELECT uid FROM board_children" + where);
		
        while (rows2.isValidRow()) {
            uids2.push(rows2.fieldByName('uid'));
            rows2.next();
        }
        rows2.close();
        
        nodes2 = Database.entity.db('main', 'board_children').loadMultiple(uids2, ['title'], true);
        for (var num = 0, numNodes = nodes2.length; num < numNodes; num++) {
        	nodes2[num].kind = 'node';
        }
        
        // merge arrays
        var nodes = nodes1.concat(nodes2);
		
		return nodes;
	}

    feri.ui.createBoardCatWindow = function (w) {
        
        // create main day window
        var boardWindow = Titanium.UI.createWindow({
            id: 'boardCatWindow',
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
        
        boardWindow.add(tableview);
		
        return boardWindow;
    };
    
    // cat window
    feri.ui.createBoardCatTable = function(w, addFavRows) {
    	
    	// geting the data from new method
    	var data = feri.ui.getBoardCatTableData(w, addFavRows);
        var tableview = Titanium.UI.createTableView({
        	data: data
        });
        
        return tableview;
    };
    
    feri.ui.getBoardCatTableData = function(w, addFavRows) {
    	
    	var data = [];
    	
    	// add the favourites
    	if( addFavRows == true ) {
	        
	        var favs = getNodeCat(false, false, true);
	        var conn = Database.db.getConnection('main');
	        
	        if ( favs.length > 0 ) {
	        	
	        	data.push(feri.ui.createHeaderRow('Priljubljene'));
	        
		        for (var favNum = 0, numFavs = favs.length; favNum < numFavs; favNum++) {
		            var fav = favs[favNum];
		            
		            var favTitle = feri.cleanSpecialChars(fav.title);
		            
		            // if we have a category that starts with number
		            // we need to get it's parent
		            if ( feri.is_int(fav.title[0]) ) {
		            	var rows = conn.query("SELECT title FROM board_parents WHERE uid = " + fav.parent);
		            	var addTitle = rows.fieldByName('title');
		            	rows.close();
				        favTitle = favTitle + ', ' + addTitle;
		            }
		            
		            var favRow = Ti.UI.createTableViewRow({
		                className: 'cs_fav',
		                selectedColor: '#000',
		                backgroundColor: '#fff',
		                color: '#000',
		                uid: fav.uid,
		                catTitle: favTitle,
		                hasDetail: false,
		                hasChild: true,
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
		                bottom: 10,
		                right: 10,
		                height: 'auto',
		                touchEnabled: false
		            });
		
		            favRow.add(favLabel);
		            
					data.push(favRow);
		        }
	        }
    	}
    	
    	data.push(feri.ui.createHeaderRow('Kategorije'));
    	
    	// OGLASNA DESKA
        var cats = [];
        if ( w != undefined)
        	cats = getNodeCat(w.uid, true, false);
        else
        	cats = getNodeCat(0, true, false);
        
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
            } else {
            	catRow.hasDetail = true;
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
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            catRow.add(catLabel);
            
			data.push(catRow);
        }
        
        return data;
    } 
    
})();