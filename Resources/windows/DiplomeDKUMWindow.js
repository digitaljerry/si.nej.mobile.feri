
(function () {
    feri.ui.createDiplomeDKUMWindow = function (w) {
    	
    	var dkumWindow = Titanium.UI.createWindow({
            id: 'diplomeDKUMWindow',
            title: 'DKUM',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        var dkum_url;
        if (w.url != '' && w.url != undefined)
        	dkum_url = w.url;
        else
        	dkum_url = 'http://dkum.uni-mb.si/Iskanje.php?type=napredno&niz0=&vrsta=dip&vir=3&chkFullOnly=on';
        
        var webview = Ti.UI.createWebView({
        	url: dkum_url
        });
        
		// web controls
		var bb2 = Titanium.UI.createButtonBar({
			labels:['Back', 'Reload', 'Forward'],
			backgroundColor:'#003'
		});
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		dkumWindow.setToolbar([flexSpace,bb2,flexSpace]);
		webview.addEventListener('load',function(e)
		{
			Ti.API.debug("url = "+webview.url);
			Ti.API.debug("event url = "+e.url);
		});
		bb2.addEventListener('click',function(ce)
		{
			if (ce.index == 0)
			{
				webview.goBack();
			}
			else if (ce.index == 1)
			{
				webview.reload();
			}
			else
			{
				webview.goForward();
			}
		});
		
		dkumWindow.add(webview);
        
        return dkumWindow;
    };
})();
