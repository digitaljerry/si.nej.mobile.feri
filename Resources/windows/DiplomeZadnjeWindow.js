
(function () {
	
	feri.ui.createDiplomeZadnjeWindow = function (w) {
		
		var diplomeZadnjeWindow = Titanium.UI.createWindow({
            id: 'diplomeZadnjeWindow',
            title: 'Zadnje diplome',
            backgroundColor: '#FFF',
            barColor: feri.ui.barColor,
            navBarHidden: false,
            fullscreen: false
        });
        
        // android back button listener
		if (feri.isAndroid()) {
			diplomeZadnjeWindow.addEventListener('android:back',function(){
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
		}
		
        return diplomeZadnjeWindow;
    };
    
})();