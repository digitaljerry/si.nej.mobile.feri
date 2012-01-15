
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
        
        var data = [];
        
        data.push(feri.ui.createHeaderRow('Aktualni zagovori'));
        
        //var sessions = Drupal.entity.db('main', 'diplome').loadMultiple(uids, ['uid'], false);
        //for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
            /*var sessionTitle = 'NIZKOCENOVNI OPTIČNI SPEKTRALNI ANALIZATOR';
            var sessionCandidate = 'LILEK MATIC';
            var sessionRoom = 'senatni sobi G2 (III. nadstropje)';
            var sessionDate = '13.01.2012 ob 08:00';
            
            var sessionRow = Ti.UI.createTableViewRow({
                hasChild: true,
                className: 'cs_session',
                selectedColor: '#000',
                backgroundColor: '#fff',
                color: '#000',
                uid: '1',
                sessionTitle: sessionTitle,
                height: 'auto',
                layout: 'vertical',
                focusable: true
            });
			
            var leftSpace = 10;
            var titleColor = '#1C4980';
            
            var titleLabel = Ti.UI.createLabel({
                text: sessionTitle,
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                color: titleColor,
                left: leftSpace,
                top: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            // Some sessions have multiple people
            var candidateLabel = Ti.UI.createLabel({
                text: sessionCandidate,
                font: {
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                color: '#000',
                left: leftSpace,
                top: 4,
                bottom: 10,
                right: 10,
                height: 'auto',
                touchEnabled: false
            });

            sessionRow.add(titleLabel);
            sessionRow.add(candidateLabel);
			
			data.push(sessionRow);*/
        //}
        
        data.push(feri.ui.createHeaderRow('Zadnje diplome'));
        
        feri.diplomeTableView = Titanium.UI.createTableView({
            data: data
        });
        
        diplomeWindow.add(feri.diplomeTableView);

        return diplomeWindow;
    };
})();
