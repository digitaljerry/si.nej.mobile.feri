
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
        //var cssContent = Titanium.Filesystem.getFile('pages/styles_info_injection.css');
        // make it available as a variable in the webview    
		//webview.evalJS("var myCssContent = " + JSON.stringify(String(cssContent.read())) + ";");
		// create the style element with the css content    
		//webview.evalJS("var s = document.createElement('style'); s.setAttribute('type', 'text/css'); s.innerHTML = myCssContent; document.getElementsByTagName('head')[0].appendChild(s);");
		
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
		    webview.url =
		        'javascript:(function evilGenius(){' 
		            + 'var s=document.createElement("style");'
		            + 's.setAttribute("type","text/css");'
		            + 's.innerHTML="' + contents + '";'
		            + 'document.getElementsByTagName("head")[0].appendChild(s);'
		        + '})();';
		    // note that we don't use web.evalJS() -- it relies on Ti being injected in the DOM already but we're
		    // running this on an external URL, so it won't have Ti injected! web.url is the same method evalJS uses
		});
		
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