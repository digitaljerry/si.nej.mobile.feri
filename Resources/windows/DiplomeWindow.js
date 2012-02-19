
(function () {
    feri.ui.createDiplomeWindow = function () {
    	
    	var diplomeWindow = Titanium.UI.createWindow({
            id: 'diplomeWindow',
            title: 'Diplome',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        var data = [];
        var conn = Drupal.db.getConnection('main');
        
        data.push(feri.ui.createHeaderRow('Aktualni zagovori'));
        
        var rows = conn.query("SELECT uid FROM aktualne_diplome ORDER BY uid DESC LIMIT 25");
        Ti.API.debug("SELECT uid FROM aktualne_diplome ORDER BY uid DESC LIMIT 25");
        
        var uids = [];

        while (rows.isValidRow()) {
            uids.push(rows.fieldByName('uid'));
            rows.next();
        }
        rows.close();
        
		// Create aktualne diploma rows
		var diplome = Drupal.entity.db('main', 'aktualne_diplome').loadMultiple(uids, ['uid'], false);
        for (var diplomeNum = 0, numDiplome = diplome.length; diplomeNum < numDiplome; diplomeNum++) {
            var diploma = diplome[diplomeNum];
            var diplomaTitle = feri.cleanSpecialChars(diploma.title);
            var diplomaRow = Ti.UI.createTableViewRow({
                hasChild: false,
                className: 'cs_session',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                details: diploma.details,
                uid: diploma.uid,
                diplomaTitle: diplomaTitle,
                height: 'auto',
                layout: 'vertical',
                search: diplomaTitle + ' ' + diploma.candidate
            });
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var titleLabel = Ti.UI.createLabel({
                text: diplomaTitle,
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
                text: diploma.candidate + ', ' + diploma.details,
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

            diplomaRow.add(titleLabel);
            diplomaRow.add(authorLabel);

			data.push(diplomaRow);
        }
        
        data.push(feri.ui.createHeaderRow('Zadnje diplome'));
        
        var rows = conn.query("SELECT uid FROM zadnje_diplome ORDER BY uid DESC LIMIT 25");
        Ti.API.debug("SELECT uid FROM zadnje_diplome ORDER BY uid DESC LIMIT 25");
        
        var uids = [];

        while (rows.isValidRow()) {
            uids.push(rows.fieldByName('uid'));
            rows.next();
        }
        rows.close();
        
        // Create zadnje diploma rows
		var diplome = Drupal.entity.db('main', 'zadnje_diplome').loadMultiple(uids, ['uid'], false);
        for (var diplomeNum = 0, numDiplome = diplome.length; diplomeNum < numDiplome; diplomeNum++) {
            var diploma = diplome[diplomeNum];
            var diplomaTitle = feri.cleanSpecialChars(diploma.title);
            var diplomaRow = Ti.UI.createTableViewRow({
                hasChild: true,
                className: 'cs_session',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                uid: diploma.uid,
                more: true,
                height: 'auto',
                layout: 'vertical',
                focusable: true,
                search: diplomaTitle + ' ' + diploma.author
            });
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var titleLabel = Ti.UI.createLabel({
                text: diplomaTitle,
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
                text: diploma.author,
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

            diplomaRow.add(titleLabel);
            diplomaRow.add(authorLabel);

			data.push(diplomaRow);
        }
        
        data.push(feri.ui.createHeaderRow('DKUM'));
        
        var tableRow = Ti.UI.createTableViewRow({
            hasChild: true,
            className: 'cs_session',
            selectedColor: '#000',
            backgroundColor: '#fff',
            color: '#000',
            height: 'auto',
            layout: 'vertical',
            focusable: true,
            title: 'Več diplom na DKUM',
            dkum: true
        });
		
        var titleLabel = Ti.UI.createLabel({
            text: '',
            font: {
                fontSize: 16,
                fontWeight: 'bold'
            },
            top: 10,
            right: 10,
            height: 'auto',
            touchEnabled: false
        });
        data.push(tableRow);
        
        diplomeTableView = Titanium.UI.createTableView({
        	data: data,
        	filterAttribute:'search'
        });
        
        // make it searchable
        feri.getSearchbar(diplomeTableView);
        
        diplomeWindow.add(diplomeTableView);
        
        diplomeTableView.addEventListener('click', function (e) {
        	if ( e.rowData.dkum == true ) {
        		feri.navGroup.open(feri.ui.createDiplomeDKUMWindow({}), {
	                animated: true
	            });
	        } else if ( e.rowData.more == true ) {
	        	feri.navGroup.open(feri.ui.createDiplomeZadnjeWindow({uid: e.rowData.uid}), {
	                animated: true
	            });
	        }
        });
        
        return diplomeWindow;
    };
})();
