
(function () {
    feri.ui.createUrnikiSelectionWindow = function (settings) {
    	
    	if ( feri.testflight == true && !feri.isAndroid() ) {
			testflight.passCheckpoint("Urniki selection window");	
		}
		
    	feri.urniki_helper = 'http://www.feri.uni-mb.si/urniki1/lib/helper.php?type=program&program_id='; 
    	
        var urnikiSelectionWindow = Titanium.UI.createWindow({
            id: 'urnikiSelectionWindow',
            title: 'Program',
            backgroundColor: feri.ui.backgroundColor,
            barColor: feri.ui.barColor,
            fullscreen: false
        });
        
        // to check current row
        var current_program = 0;
        if ( Titanium.App.Properties.getString('urniki_program') )
        	var current_program = Titanium.App.Properties.getString('urniki_program');
        
        var data = [];
		var inputData = [
			{uid:1, title:'ELEKTROTEHNIKA UN', header: 'Izberi program'},
			{uid:2, title:'ELEKTROTEHNIKA VS'},
			{uid:18, title:'ELEKTROTEHNIKA - 2.stopnja'},
			{uid:6, title:'GOSPODARSKO INŽENIRSTVO - SMER ELEKTROTEHNIKA'},
			{uid:19, title:'GOSPODARSKO INŽENIRSTVO - SMER ELEKTROTEHNIKA - 2.stopnja'},
			{uid:7, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA UN'},
			{uid:8, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA VS'},
			{uid:20, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA - 2.stopnja'},
			{uid:10, title:'MEDIJSKE KOMUNIKACIJE'},
			{uid:21, title:'MEDIJSKE KOMUNIKACIJE - 2.stopnja'},
			{uid:17, title:'MEHATRONIKA'},
			{uid:25, title:'MEHATRONIKA VS'},
			{uid:24, title:'MEHATRONIKA - 2.stopnja'},
			{uid:11, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE UN'},
			{uid:12, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE VS'},
			{uid:22, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE - 2.stopnja'},
			{uid:16, title:'TELEKOMUNIKACIJE'},
			{uid:23, title:'TELEKOMUNIKACIJE - 2.stopnja'},
		];
		
		for (var programNum = 0, numProgram = inputData.length; programNum < numProgram; programNum++) {
            var program = inputData[programNum];
            var programRow = Ti.UI.createTableViewRow({
                hasChild: true,
                uid: program.uid,
                height: 'auto',
                selectedBackgroundColor: feri.ui.selectedBackgroundColor
            });
            
            if ( program.header )
            	programRow.header = program.header;
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var titleLabel = Ti.UI.createLabel({
                text: program.title,
                font: {
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                left: leftSpace,
                top: 10,
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });
            
            if ( current_program == program.uid )
		    	titleLabel.color = '#336699';

            programRow.add(titleLabel);
			
			data.push(programRow);
        }
		
		var tableView = Titanium.UI.createTableView({
			data:data
		});
		
		if ( !feri.isAndroid() )
			tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
		
		urnikiSelectionWindow.add(tableView);
		
		tableView.addEventListener('click', function (e) {
			if ( e.rowData.uid ) {
				
				var remoteData = [];
				feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
				
		        var xhr = Ti.Network.createHTTPClient();
		        xhr.open('GET', feri.urniki_helper + e.rowData.uid);
		        xhr.send();
		        
				xhr.onload = function () {
					remoteData = JSON.parse(this.responseText);
					feri.ui.activityIndicator.hideModal();
					
					if (feri.useDashboard) {
						feri.navGroup.open(feri.ui.createUrnikiSelection2Window({
		                    title: 'Letnik in smer',
		                    program: e.rowData.uid,
		                    data: remoteData 
		                }), {
		                    animated: true
		                });
		            } else {
		            	feri.tabUrniki.open(feri.ui.createUrnikiSelection2Window({
		                    title: 'Letnik in smer',
		                    program: e.rowData.uid,
		                    data: remoteData
		                }),{animated:true});
		            }

				};				
            }
        });
        
        // new urnik was selected so we need to refresh
		urnikiSelectionWindow.addEventListener('focus', function () {
			if ( Titanium.App.Properties.getString('urniki_program') != current_program ) {
				current_program = Titanium.App.Properties.getString('urniki_program');
				
				for (var programNum = 0, numProgram = data.length; programNum < numProgram; programNum++) {
					if ( !feri.isAndroid()) {
						if (data[programNum].uid == current_program )
							data[programNum].children[0].color = '#336699';
						else
							data[programNum].children[0].color = '#000';
					} else {
						// TODO
					}
				}
			}
        });

        return urnikiSelectionWindow;
    };

})();