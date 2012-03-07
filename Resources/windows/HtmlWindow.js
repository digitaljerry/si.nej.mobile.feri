
(function () {
    feri.ui.createHtmlWindow = function (settings) {
        Database.setDefaults(settings, {
            title: 'title here',
            url: ''
        });

        var htmlWindow = Titanium.UI.createWindow({
            id: 'htmlWindow',
            title: settings.title,
            backgroundColor: '#FFF',
            barColor: feri.ui.barColor,
            width: '100%',
            height: '100%',
            fullscreen: false
        });
        htmlWindow.orientationModes = [Ti.UI.PORTRAIT];

        var webview = Ti.UI.createWebView({
            url: settings.url,
            width: '100%',
            height: '100%'
        });
        htmlWindow.add(webview);
        htmlWindow.addEventListener('focus', function (e) {
            webview.url = settings.url;
            webview.height = '100%';
            webview.width = '100%';
        });

        return htmlWindow;
    };

})();