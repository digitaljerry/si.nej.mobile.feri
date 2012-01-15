
(function () {
    feri.ui.createUrnikiWindow = function () {
    	
    	feri.urniki_url = 'http://www.feri.uni-mb.si/urniki1/groups.php';
    	
        var urnikiWindow = Titanium.UI.createWindow({
            id: 'urnikiWindow',
            title: 'Urniki',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        //infoWindow.add(feri.ui.createTabbedScrollableView({data:data}));
        var webview = Ti.UI.createWebView({
            url: feri.urniki_url,
            width: '100%',
            height: '100%'
        });
        
        urnikiWindow.add(webview);
		
		// adding the view
		urnikiWindow.add(webview);
        urnikiWindow.addEventListener('focus', function (e) {
            webview.url = feri.informacije_url;
            webview.height = '100%';
            webview.width = '100%';
        });
        
        return urnikiWindow;
    };
})();