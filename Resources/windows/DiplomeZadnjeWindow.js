
(function () {
	
	feri.ui.createDiplomeZadnjeWindow = function (w) {
		
		var diplomeZadnjeWindow = Titanium.UI.createWindow({
            id: 'diplomeZadnjeWindow',
            title: 'Zadnje diplome',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        // Build session data
        var sessionData = Database.entity.db('main', 'zadnje_diplome').load(w.uid);
        
        var commonPadding = 15;
        
        var tvData = [];
        var tv = Ti.UI.createTableView({
            textAlign: 'left',
            layout: 'vertical',
            separatorColor: '#fff'
        });
        tv.footerView = Ti.UI.createView({
            height: 1,
            opacity: 0
        });

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

        var bodyRow = Ti.UI.createTableViewRow({
            hasChild: false,
            height: 'auto',
            backgroundColor: '#fff',
            left: 0,
            top: -5,
            bottom: 10,
            layout: 'vertical',
            className: 'bodyRow',
            selectionStyle: 'none'
        });

        if (sessionData.title) {
            var titleLabel = Ti.UI.createLabel({
                text: feri.cleanSpecialChars(sessionData.title),
                font: {
                    fontSize: 24,
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
            headerRow.add(titleLabel);
        }
        
        if (sessionData.author) {
            var author = Ti.UI.createLabel({
                text: sessionData.author,
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
            headerRow.add(author);
        }
        
        if (sessionData.description) {
            var body = Ti.UI.createLabel({
                text: feri.cleanSpecialChars(sessionData.description),
                backgroundColor: '#fff',
                textAlign: 'left',
                color: '#000',
                height: 'auto',
                width: feri.isAndroid() ? '92%' : 'auto',
                top: 15,
                bottom: 15,
                font: {
                    fontSize: 16
                }
            });
            bodyRow.add(body);
        }

        if (!feri.isAndroid()) {
            body.right = commonPadding;
            body.left = commonPadding;
        }

        tvData.push(headerRow);
        tvData.push(feri.ui.createHeaderRow('Obvestilo'));
        tvData.push(bodyRow);
        
        // files
        if (sessionData.link) {
        	
        	tvData.push(feri.ui.createHeaderRow('DKUM'));
            
            var tableRow = Ti.UI.createTableViewRow({
	            hasChild: true,
	            className: 'cs_session',
	            selectedColor: '#000',
	            backgroundColor: '#fff',
	            color: '#000',
	            height: 'auto',
	            layout: 'vertical',
	            focusable: true,
	            title: 'Več o diplomi',
	            dkum_url: sessionData.link
	        });
            
            tvData.push(tableRow);
        }

        tv.addEventListener('click', function (e) {
        	if ( e.rowData.dkum_url ) {
        		feri.navGroup.open(feri.ui.createWebViewWindow({url: e.rowData.dkum_url}), {
	                animated: true
	            });
	        }
        });
        
        tv.setData(tvData);
        diplomeZadnjeWindow.add(tv);
		
        return diplomeZadnjeWindow;
    };
    
})();