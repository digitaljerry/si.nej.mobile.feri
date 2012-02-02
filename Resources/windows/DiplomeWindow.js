
(function () {
    feri.ui.createDiplomeWindow = function () {
    	
    	var diplomeWindow = Titanium.UI.createWindow({
            id: 'diplomeWindow',
            title: 'Diplome',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });
        
        var content = '';
        
        var f1 = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'pages/zadnjizagovori.html');
        content = content + f1.read();
        var f2 = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'pages/zadnjediplome.html');
        content = content + f2.read();
        
        var webview = Ti.UI.createWebView({
        	html:'<html><head></head><body>'+content+'</body></html>',
        	evaljs:true
        });
        //webview.evalJS("showFeeds('http://dkum.uni-mb.si/rss.php?o=3&v=dip','oglasna_deska')");
        //webview.scalesPageToFit = true;
        
        diplomeWindow.add(webview);
        
        return diplomeWindow;
    };
})();
