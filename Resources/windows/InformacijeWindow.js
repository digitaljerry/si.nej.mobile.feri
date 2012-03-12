
(function () {
    feri.ui.createInformacijeWindow = function () {
    	
    	feri.informacije_url = 'http://www.feri.uni-mb.si/podrocje.aspx?id=2';
    	
        var infoWindow = Titanium.UI.createWindow({
            id: 'informacijeWindow',
            title: 'Informacije',
            backgroundColor: '#FFF',
            barColor: feri.ui.barColor,
            navBarHidden: false,
            fullscreen: false
        });
        
        var webview = Ti.UI.createWebView({
            url: feri.informacije_url,
            width: '100%',
            height: '100%'
        });
        
        //feri.getWebcontrols(infoWindow, webview);
        
        // injecting css for better display on mobile
        // inject our css when the web view finishes loading (because we need to inject into the head element)
		webview.addEventListener('load', function () {
			
			if ( !feri.isAndroid() ) {
				// first, specify the CSS file that we should load
			    var cssFileName = 'pages/styles_info_injection.css';
			    
			    if ( feri.isAndroid() )
			    	cssFileName = '/pages/styles_info_injection.css';
			    
			    // read in the contents
			    var cssFromFile = Ti.Filesystem.getFile(cssFileName);
			    alert(cssFromFile);
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
		    }
		    
		    webview.setVisible(true);
		    
		    feri.ui.activityIndicator.hideModal();
		});
		
		webview.addEventListener('beforeload', function () {
			feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
		});
		
		infoWindow.add(webview);
		
		// android back button listener
		if (feri.isAndroid()) {
			infoWindow.addEventListener('android:back',function(){
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
		}
		
		return infoWindow;
    };
})();
