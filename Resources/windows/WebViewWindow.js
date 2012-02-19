
(function () {
    feri.ui.createWebViewWindow = function (w) {
    	
    	if ( w.title == 'undefined')
    		w.title = '';
    	
    	var webViewWindow = Titanium.UI.createWindow({
            id: 'webViewWindow',
            title: w.title,
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        var webview = Ti.UI.createWebView({
        	url: w.url
        });
        
        webViewWindow.addEventListener('beforeload', function (e) {
        	feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
        });
        
        webViewWindow.addEventListener('load', function (e) {
        	feri.ui.activityIndicator.hideModal();
        });
        
		feri.getWebcontrols(webViewWindow, webview);
		
		webViewWindow.add(webview);
        
        return webViewWindow;
    };
})();
