
(function () {
    feri.ui.createAboutWindow = function () {
        var aboutWindow = Titanium.UI.createWindow({
            id: 'aboutWindow',
            title: 'FERI',
            backgroundColor: '#dddddd',
            barColor: feri.ui.barColor,
            navBarHidden: false,
            fullscreen: false
        });
        
        var version = Ti.App.getVersion();
        var feriWindow = Ti.UI.createWebView({url: '/pages/about.html'});
        var appWindow = Ti.UI.createWebView({url: '/pages/app.html'});
        
        appWindow.addEventListener('load', function() {
			appWindow.evalJS("document.getElementById('version').innerText='"+version+"';");
		});
        
        var data = [
        	{
	            title: 'FERI',
	            view: feriWindow
        	}, 
        	{
	            title: 'Aplikacija',
	            view: appWindow
        	}
        ];
        aboutWindow.add(feri.ui.createTabbedScrollableView({data:data}));
        
        // android back button listener
		if (feri.isAndroid()) {
			aboutWindow.addEventListener('android:back',function(){
				alert(feri.iconWin);
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
		}
        
        return aboutWindow;
    };
})();