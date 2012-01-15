
(function () {
    feri.ui.createInformacijeWindow = function () {
    	
    	feri.informacije_url = 'http://www.feri.uni-mb.si/podrocje.aspx?id=2';
    	
        var infoWindow = Titanium.UI.createWindow({
            id: 'informacijeWindow',
            title: 'Informacije',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        //infoWindow.add(feri.ui.createTabbedScrollableView({data:data}));
        var webview = Ti.UI.createWebView({
            url: feri.informacije_url,
            width: '100%',
            height: '100%'
        });
        
        //injecting css for better display on mobile
        var cssContent = Titanium.Filesystem.getFile('pages/styles_info_injection.css');
        // make it available as a variable in the webview    
		webview.evalJS("var myCssContent = " + JSON.stringify(String(cssContent.read())) + ";");
		// create the style element with the css content    
		webview.evalJS("var s = document.createElement('style'); s.setAttribute('type', 'text/css'); s.innerHTML = myCssContent; document.getElementsByTagName('head')[0].appendChild(s);");
		
		webview.repaint();
		infoWindow.add(webview);
		
		// adding the view
		/*infoWindow.add(webview);
        infoWindow.addEventListener('focus', function (e) {
            webview.url = feri.informacije_url;
            webview.height = '100%';
            webview.width = '100%';
        });*/
        
        return infoWindow;
    };
})();