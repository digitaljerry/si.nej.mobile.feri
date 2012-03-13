
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
        var data = [
        	{
	            title: 'FERI',
	            view: Ti.UI.createWebView({
	                url: '/pages/about.html'
	            })
        	}, 
        	{
	            title: 'Aplikacija',
	            view: Ti.UI.createWebView({
	                url: '/pages/app.html'
	            })
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