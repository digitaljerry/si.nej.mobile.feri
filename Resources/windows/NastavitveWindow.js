
(function () {

    feri.ui.createNastavitveWindow = function () {
        var NastavitveWindow = Titanium.UI.createWindow({
            id: 'nastavitveWindow',
            title: 'Nastavitve',
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        
        // Create the table view
        var inputData = [
			{title:'Dashboard', switchAppUse: 'dashboard', header:'Oblika'},
			{title:'Zavihki', switchAppUse: 'tabs'},
			{title:'Dashboard', hasCheck:true, header:'Začetna stran'},
			{title:'Oglasna deska'},
			{title:'Urnik'},
			{title:'Zaposleni'},
			{title:'Zemljevid'},
			{title:'Diplome'},
			{title:'Informacije'}
		];
		
		if ( feri.useDashboard == true )
			inputData[0].hasCheck = true;
		else
			inputData[1].hasCheck = true;
		
		var row1 = Ti.UI.createTableViewRow({
			height:50,
			title:'Shake to reload',
			header:'Osveži oglasno desko'
			});
		var sw1 = Ti.UI.createSwitch({
			right:10,
			value:false
		});
		var row2 = Ti.UI.createTableViewRow({
			height:50,
			title:'Ob zagonu'
			});
		var sw2 = Ti.UI.createSwitch({
			right:10,
			value:true
		});
	
		row1.add(sw1);
		row2.add(sw2);
		
		inputData.push(row1);
		inputData.push(row2);
		
		var tableView = Titanium.UI.createTableView({
			data:inputData,
			style:Titanium.UI.iPhone.TableViewStyle.GROUPED
		});
        
        // create table view event listener
        tableView.addEventListener('click', function (e) {
            
        });

        // add table view to the window
        NastavitveWindow.add(tableView);
        
        tableView.addEventListener('click', function (e) {
			
			var section = e.section;
			
			// app use switch
			if ( e.rowData.switchAppUse ) {
				if ( e.rowData.switchAppUse == 'dashboard' && feri.useDashboard == false) {
					section.rows[0].hasCheck = true;
					section.rows[1].hasCheck = false;
					Titanium.App.Properties.setString('feri.useDashboard', 'true');
					feri.useDashboard = true;
					Ti.include('windows/main.js');
				} else if ( e.rowData.switchAppUse == 'tabs' && feri.useDashboard == true) {
					section.rows[0].hasCheck = false;
					section.rows[1].hasCheck = true;
					Titanium.App.Properties.setString('feri.useDashboard', 'false');
					feri.useDashboard = false;
					feri.ui.activityIndicator.showModal('Posodabljam ...');
					Ti.include('windows/main.js');
				}
			}
			
		});
		
        return NastavitveWindow;
    };

})();