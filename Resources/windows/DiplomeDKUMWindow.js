
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
        
		feri.getWebcontrols(dkumWindow, webview);
		
		dkumWindow.add(webview);
        
        return dkumWindow;
    };
})();
