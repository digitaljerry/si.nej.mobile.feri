
(function () {
    feri.ui.createAboutWindow = function () {
        var aboutWindow = Titanium.UI.createWindow({
            id: 'aboutWindow',
            title: 'About',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        var data = [
        	{
	            title: 'FERI',
	            view: Ti.UI.createWebView({
	                url: 'pages/about.html'
	            })
        	}, 
        	{
	            title: 'Aplikacija',
	            view: Ti.UI.createWebView({
	                url: 'pages/app.html'
	            })
        	}
        ];
        
        aboutWindow.add(feri.ui.createTabbedScrollableView({data:data}));
        
        return aboutWindow;
    };
})();