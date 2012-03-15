
(function () {
    feri.ui.createUrnikiSelection2Window = function (settings) {
    	
    	feri.urniki_helper2 = 'http://www.feri.uni-mb.si/urniki1/lib/helper.php?type=branch&branch_id=';
    	
        var urnikiSelection2Window = Titanium.UI.createWindow({
            id: 'urnikiSelection2Window',
            title: 'Letnik in smer',
            barColor: feri.ui.barColor,
            backgroundColor: feri.ui.backgroundColor,
            fullscreen: false
        });
        
        // to check current row
        var current_branch = 0;
        if ( Titanium.App.Properties.getString('urniki_branch') )
        	var current_branch = Titanium.App.Properties.getString('urniki_branch');
        
        var data = [];
		var inputData = [];
		var sections = [];
		sections[0] = [];
		sections[1] = [];
		sections[2] = [];
		sections[3] = [];
		sections[4] = [];
		sections[5] = [];
		
		for (var programNum = 0, numProgram = settings.data.result[1].length; programNum < numProgram; programNum++) {
			var dataRow = settings.data.result[1][programNum];
			
			sections[dataRow.year].push(
				{
				uid: dataRow.branch_id,
				title: dataRow.name, header: dataRow.year + '. letnik',
				urniki_data: settings.data.result[1][programNum]
				}
			);
		}
		
		for (var sectionNum = 0, numSection = sections.length; sectionNum < numSection; sectionNum++) {
			
			if ( sections[sectionNum].length > 0 ) {
				
				var prevHeader = '';
				for (var programNum = 0, numProgram = sections[sectionNum].length; programNum < numProgram; programNum++) {
					
		            var program = sections[sectionNum][programNum];
		            var programRow = Ti.UI.createTableViewRow({
		                hasChild: false,
		                letnik: program.letnik,
		                height: 'auto',
		                selectedBackgroundColor: feri.ui.selectedBackgroundColor,
		                urniki_data: program.urniki_data
		            });
		            
		            if ( program.header != prevHeader ) {
		            	programRow.header = program.header;
		            	prevHeader = programRow.header; 
		            }
					
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
		            
		            if ( current_branch == program.urniki_data.branch_id ) {
		            	programRow.hasCheck = true;
		            	titleLabel.color = '#336699';
		            }
		
		            programRow.add(titleLabel);
					
					data.push(programRow);
		        }
				
			}
			
        }
		
		var tableView = Titanium.UI.createTableView({
			data:data
		});
		
		if ( !feri.isAndroid() )
			tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
		
		urnikiSelection2Window.add(tableView);
		
		tableView.addEventListener('click', function (e) {
			
			var row = e.row;
			
			setTimeout(function()
			{
				// reset checks
				for (var j=0;j<tableView.sections.length;j++) {
					for (var i=0;i<tableView.sections[j].rows.length;i++) {
						tableView.sections[j].rows[i].hasCheck = false;
						tableView.sections[j].rows[i].children[0].color = '#000';
					}
				}
				
				// set current check
				row.hasCheck = true;
				row.children[0].color = '#336699';
				
			},250);
			
			var remoteData = [];
			feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadTimeout, 'Napaka pri povezavi.');
			
	        var xhr = Ti.Network.createHTTPClient();
	        xhr.open('GET', feri.urniki_helper2 + row.urniki_data.branch_id);
	        xhr.send();
	        
			xhr.onload = function () {
				remoteData = JSON.parse(this.responseText);
				
				var groups = '';
				for (var i=0;i<remoteData.groups.length;i++) {
					groups = groups + remoteData.groups[i].groups_id + ',';
				}
				
				groups = groups.slice(0, -1);

				Titanium.App.Properties.setString('urniki_groups', groups);
				Titanium.App.Properties.setString('urniki_branch', row.urniki_data.branch_id);
				Titanium.App.Properties.setString('urniki_program', settings.program);
				Titanium.App.Properties.setString('urniki_changed', 'true');
				
				feri.ui.activityIndicator.hideModal();
			};	
			
        });

        return urnikiSelection2Window;
    };

})();