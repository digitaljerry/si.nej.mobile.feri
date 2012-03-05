
(function () {

    feri.ui.createBoardDetailWindow = function (settings) {
        Database.setDefaults(settings, {
            title: 'title here',
            nid: ''
        });
        
        var commonPadding = 15;
        var sessionDetailWindow = Titanium.UI.createWindow({
            id: 'boardDetailWindow',
            title: settings.title,
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        sessionDetailWindow.orientationModes = [Ti.UI.PORTRAIT];

        // Build session data
        var sessionData = Database.entity.db('main', 'node').load(settings.nid);
        
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
            headerRow.add(titleLabel);
        }

		var dateWithTime = '';
        if (sessionData.date) {
        	
        	var timestamp = feri.datetime.strtotime(sessionData.date);
        	dateWithTime = feri.datetime.normalDate(timestamp) + ' ' + feri.datetime.cleanTime(sessionData.date);
        	
            var datetime = Ti.UI.createLabel({
                text: dateWithTime,
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
            headerRow.add(datetime);
        }
        
        var boardDetailWebview = Titanium.UI.createWebView({
			html:'<html><body style="font-family: Helvetica !important;"><p><h1 style="font-size: 28px;">'+sessionData.title+'</h1><h3 style="font-size: 18px;">'+dateWithTime+'</h3></p>'+sessionData.body+'</body></html>',
			height:'100%'
		});
        
        tvData.push(feri.ui.createHeaderRow('Obvestilo'));
        tvData.push(bodyRow);
        
        // files
        if (sessionData.files) {
        	
        	var filesList = sessionData.files.split(",");
        	tvData.push(feri.ui.createHeaderRow((filesList.length > 1) ? 'Datoteke' : 'Datoteka'));
            for (var k = 0; k < filesList.length; k++) {
            	tvData.push(renderFile(filesList[k]));
            }
        }
        
       	var toolbarActive = false;
       
       if (!feri.isAndroid()) {
	       	// open on web
			var bb2 = Titanium.UI.createButtonBar({
				labels:['Odpri na spletu'],
				backgroundColor:'#003'
			});
			var flexSpace = Titanium.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			
			sessionDetailWindow.setToolbar([flexSpace,bb2,flexSpace]);
			
			bb2.addEventListener('click',function(ce)
			{
				//feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
				//boardDetailWebview.url = 'http://www.feri.uni-mb.si/odeska/brnj2.asp?id=' + sessionData.nid;
				//feri.getWebcontrols(sessionDetailWindow, boardDetailWebview);
				
				var url = 'http://www.feri.uni-mb.si/odeska/brnj2.asp?id=' + settings.nid;
				if (feri.useDashboard) {
					feri.navGroup.open(feri.ui.createWebViewWindow({url: url}), {
						animated: true
					});
				} else {
					feri.tabOglasna.open(feri.ui.createWebViewWindow({url: url}),{animated:true});
				}
			});
		}
       
       	boardDetailWebview.addEventListener('beforeload', function (e) {
       		if (e.url && toolbarActive == false)
       			feri.getWebcontrols(sessionDetailWindow, boardDetailWebview);
       		return;
        	//feri.getWebcontrols(sessionDetailWindow, boardDetailWebview);
        });
        //tv.setData(tvData);
        //sessionDetailWindow.add(tv);
        sessionDetailWindow.add(boardDetailWebview);
        
        boardDetailWebview.addEventListener('load', function (e) {
       		feri.ui.activityIndicator.hideModal();
       		return;
        });

        return sessionDetailWindow;
    };

    function renderAuthor(author) {
       var presRow = Ti.UI.createTableViewRow({
            author: author,
            height: 60,
            className: 'authorRow',
            borderColor: '#C4E2EF',
            hasChild: true,
            backgroundColor: '#6ca2c8',
            layout: 'vertical'
        });
        presRow[feri.ui.backgroundSelectedProperty + 'Color'] = feri.ui.backgroundSelectedColor;
        
        var authorFullName2 = Ti.UI.createLabel({
            author: author,
            text: feri.cleanSpecialChars(author.full_name),
            font: {
                fontSize: 18,
                fontWeight: 'bold'
            },
            left: 75,
            top: -45,
            height: 'auto',
            color: '#fff',
            touchEnabled: false
        });

        var authorName2 = Ti.UI.createLabel({
            author: author,
            text: feri.cleanSpecialChars(author.position),
            font: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            left: 75,
            bottom: 10,
            height: 'auto',
            color: "#fff",
            touchEnabled: false
        });

        presRow.add(authorFullName2);
        presRow.add(authorName2);

        return presRow;
    }
    
    function getFileName(filename) {
		//this gets the full url
		var url = filename;
		//this removes the anchor at the end, if there is one
		url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
		//this removes the query after the file name, if there is one
		url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
		//this removes everything before the last slash in the path
		url = url.substring(url.lastIndexOf("/") + 1, url.length);
		//return
		return url;
	}
    
    function renderFile(filename) {

        var fileRow = Ti.UI.createTableViewRow({
        	file:filename,
            className: 'fileRow',
            borderColor: '#C4E2EF',
            hasChild: true,
            layout: 'vertical'
        });
        //fileRow[feri.ui.backgroundSelectedProperty + 'Color'] = feri.ui.backgroundSelectedColor;
        
        var filename = Ti.UI.createLabel({
            text: feri.cleanSpecialChars(getFileName(filename)),
            font: {
                fontSize: 14
            },
            top: 14,
            bottom: 10,
            right: 10,
            left: 75,
            height: 'auto',
            color: '#000',
            touchEnabled: false
        });

        fileRow.add(filename);
        
    	return fileRow;
    }
    
})();