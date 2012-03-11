
(function () {
    feri.ui.createUrnikiSelectionWindow = function (settings) {
    	
    	feri.urniki_helper = 'http://www.feri.uni-mb.si/urniki1/lib/helper.php?type=program&program_id='; 
    	
        var urnikiSelectionWindow = Titanium.UI.createWindow({
            id: 'urnikiSelectionWindow',
            title: 'Program',
            barColor: feri.ui.barColor,
            fullscreen: false
        });
        
        var data = [];
		var inputData = [
			{uid:18, title:'ELEKTROTEHNIKA (BM10) - 2.stopnja', header: 'Izberi program'},
			{uid:1, title:'ELEKTROTEHNIKA UN (BU10)'},
			{uid:2, title:'ELEKTROTEHNIKA VS (BV10)'},
			{uid:19, title:'GOSPODARSKO INŽENIRSTVO - SMER ELEKTROTEHNIKA (BM60) - 2.stopnja'},
			{uid:6, title:'GOSPODARSKO INŽENIRSTVO - SMER ELEKTROTEHNIKA (BU60)'},
			{uid:20, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA (BM30) - 2.stopnja'},
			{uid:7, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA UN (BU30)'},
			{uid:8, title:'INFORMATIKA IN TEHNOLOGIJE KOMUNICIRANJA VS (BV30)'},
			{uid:21, title:'MEDIJSKE KOMUNIKACIJE (BM50) - 2.stopnja'},
			{uid:10, title:'MEDIJSKE KOMUNIKACIJE (BU50)'},
			{uid:24, title:'MEHATRONIKA (BMM7) - 2.stopnja'},
			{uid:17, title:'MEHATRONIKA (BU70)'},
			{uid:25, title:'MEHATRONIKA VS (BV70)'},
			{uid:22, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE (BM20) - 2.stopnja'},
			{uid:11, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE UN (BU20)'},
			{uid:12, title:'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE VS (BV20)'},
			{uid:23, title:'TELEKOMUNIKACIJE (BM40) - 2.stopnja'},
			{uid:16, title:'TELEKOMUNIKACIJE (BU40)'}
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

            programRow.add(titleLabel);
			
			data.push(programRow);
        }
		
		var tableView = Titanium.UI.createTableView({
			data:data,
			style:Titanium.UI.iPhone.TableViewStyle.GROUPED
		});
		
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
		                    title: 'Letnik',
		                    program: e.rowData.uid,
		                    data: remoteData 
		                }), {
		                    animated: true
		                });
		            } else {
		            	feri.tabOglasna.open(feri.ui.createUrnikiSelection2Window({
		                    title: 'Letnik',
		                    program: e.rowData.uid,
		                    data: remoteData
		                }),{animated:true});
		            }

				};				
            }
        });

        return urnikiSelectionWindow;
    };

})();