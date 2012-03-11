
(function () {
    feri.ui.createUrnikiWindow = function () {
    	
    	var diff = 0;
    	feri.urniki_url = 'http://www.feri.uni-mb.si/urniki1/groups.php';
    	
    	var urnikiWindow = Titanium.UI.createWindow({
            id: 'urnikiWindow',
            title: 'Urniki',
            backgroundColor: feri.ui.urnikiColor,
            barColor: feri.ui.barColor,
            navBarHidden: false,
            fullscreen: false
        });
        
        //infoWindow.add(feri.ui.createTabbedScrollableView({data:data}));
        var webview = Ti.UI.createWebView({
        	backgroundColor: feri.ui.urnikiColor,
            width: '100%',
            height: '100%'
        });
        
        webview.addEventListener('load', function () {
		    feri.ui.activityIndicator.hideModal();
		});
		
		refreshUrniki();
		
        // adding the view
		urnikiWindow.add(webview);
		
		// reload controls listeners
		var bb2 = Titanium.UI.createButtonBar({
			labels:['Prejšnji', 'Trenutni teden', 'Naslednji'],
			backgroundColor:feri.ui.toolbarColor
		});
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		// TODO
		if ( !feri.isAndroid() ) {
			urnikiWindow.setToolbar([flexSpace,bb2,flexSpace]);
		} else {}
		
		bb2.addEventListener('click',function(ce)
		{
			if (ce.index == 0)
			{
				if ( diff > 0 )
					diff = 0;
				
				diff = diff - 1;
				refreshUrniki(diff);
			}
			else if (ce.index == 1)
			{
				diff = 0;
				refreshUrniki(diff);
			}
			else
			{
				if ( diff < 0 )
					diff = 0;
				
				diff = diff + 1;
				refreshUrniki(diff);
			}
		});
        
        // android back button listener
		if (feri.isAndroid()) {
			urnikiWindow.addEventListener('android:back',function(){
				feri.navGroup.close(feri.iconWin, {
                    animated: true
                });
                // re-enabling the icons on the dashboard
                feri.dashboardActive = true;
			});
		}
		
		Ti.addEventListener('feri:set_urniki', function () {
			if (feri.useDashboard) {
				feri.navGroup.open(feri.ui.createUrnikiSelectionWindow({
                    title: 'Program'
                }), {
                    animated: true
                });
            } else {
            	feri.tabOglasna.open(feri.ui.createUrnikiSelectionWindow({
                    title: 'Program'
                }),{animated:true});
            }
		});
		
		function refreshUrniki(customDate) {
			
			// we try to get th efirst request from cache
			var urniki_local = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'urniki_cached.html');
			
			if( urniki_local.exists() && customDate === undefined ) {
				
				webview.html = urniki_local.read().text;
				webview.setVisible(true);
			
			} else {
				
				feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
				
				var xhr = Ti.Network.createHTTPClient();
				xhr.open('POST', feri.urniki_url);
				xhr.setRequestHeader('Content-Type', 'text/html; charset=Windows-1250');
				xhr.onload = function () {
					webview.html = this.responseText;
					webview.setVisible(true);
				    feri.ui.activityIndicator.hideModal();
				    
				    // we cache it
					urniki_local.write(this.responseText);
				};
				
				var groups = Titanium.App.Properties.getString('urniki_groups');
				var branch = Titanium.App.Properties.getString('urniki_branch');
				
				// set the date
				var date = getDate(customDate);
				
		        xhr.send({
					date_field:date,
					branch_id:branch,
					//program_index:"15",
					//groups_index:"1,2,3,4,5,6,7,8,9",
					groups_values:groups
				});
				
			}
			
		}
		
		function getDate(custom) {
			
			var today = new Date();
			if ( custom !== undefined )
				today = addDays(today, custom*7);
			
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy;
			var date = dd+'.'+mm+'.'+yyyy;
			
			return date;
		}
		
		function addDays(myDate,days) {
			return new Date(myDate.getTime() + days*24*60*60*1000);
		}
		     
        return urnikiWindow;
    };
})();