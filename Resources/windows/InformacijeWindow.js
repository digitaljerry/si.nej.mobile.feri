
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
        
        var webview = Ti.UI.createWebView({
            url: feri.informacije_url,
            width: '100%',
            height: '100%',
            visible: false
        });
        
        // web controls
		var bb2 = Titanium.UI.createButtonBar({
			labels:['Back', 'Reload', 'Forward'],
			backgroundColor:'#003'
		});
		
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		infoWindow.setToolbar([flexSpace,bb2,flexSpace]);
        
        //injecting css for better display on mobile
        // inject our css when the web view finishes loading (because we need to inject into the head element)
		webview.addEventListener('load', function () {
		    // first, specify the CSS file that we should load
		    var cssFileName = 'pages/styles_info_injection.css';
		    // read in the contents
		    var cssFromFile = Ti.Filesystem.getFile(cssFileName);
		    // clean the contents so we can put them in a JS string
		    var contents = String(cssFromFile.read())
		        .split('\r').join('')
		        .split('\n').join(' ')
		        .split('"').join('\\"');
		    
		    // and run the JavaScript to inject the CSS by setting the URL of the web view
		    // (hint: try running "javascript:alert('Hello, world!');" in your own browser to see what happens
		    webview.evalJS('javascript:(function evilGenius(){' 
		    				+ 'var s=document.createElement("style");'
            				+ 's.setAttribute("type","text/css");'
            				+ 's.innerHTML="' + contents + '";'
            				+ 'document.getElementsByTagName("head")[0].appendChild(s);'
        					+ '})();');
		    // note that we don't use web.evalJS() -- it relies on Ti being injected in the DOM already but we're
		    // running this on an external URL, so it won't have Ti injected! web.url is the same method evalJS uses
		    
		    webview.setVisible(true);
		});
		
		webview.addEventListener('beforeload', function () {
			webview.setVisible(false);
		});
		
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
		
		infoWindow.add(webview);
		
		return infoWindow;
    };
})();