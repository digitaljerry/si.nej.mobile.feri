(function() {

  feri.ui.createNastavitveBoardEditListWindow = function(w) {

    var conn = Database.db.getConnection('main');
    var where = '';

    // getting entity from db
    if (w.edit == 'favorites')
      where = ' WHERE favourite = 1 OR push = \'true\'';
    else if (w.edit == 'push')
      where = ' WHERE push = 1 OR push = \'true\'';
    else
      return;

    var uids = [];
    var nodes = [];
    var rows = conn.query("SELECT uid FROM board_children" + where);

    while (rows.isValidRow()) {
      uids.push(rows.fieldByName('uid'));
      rows.next();
    }
    rows.close();

    nodes = Database.entity.db('main', 'board_children').loadMultiple(uids, ['title'], true);

    // Create data for TableView
    var data = [];

    for (var nodeNum = 0, numNodes = nodes.length; nodeNum < numNodes; nodeNum++) {

      var node = nodes[nodeNum];
      var nodeTitle = feri.cleanSpecialChars(node.title);

      var nodeRow = Ti.UI.createTableViewRow({
        uid : node.uid,
        hasDetail : false,
        hasChild : false,
        height : 50,
        layout : 'vertical',
        focusable : true,
        selectedBackgroundColor : feri.ui.selectedBackgroundColor
      });

      var nodeLabel = Ti.UI.createLabel({
        text : nodeTitle,
        font : {
          fontSize : 20,
          fontWeight : 'bold'
        },
        left : 10,
        top : 12,
        right : 10,
        touchEnabled : false,
        height : 'auto'
      });

      nodeRow.add(nodeLabel);

      data.push(nodeRow);
    }

    if (data.length == 0) {

      var sessionRow = Ti.UI.createTableViewRow({
        hasChild : false,
        className : 'cs_session',
        date : '',
        uid : 0,
        height : 'auto',
        layout : 'vertical',
        color : feri.ui.inactiveText,
        focusable : false,
        title : lang['ni_kategorij'],
        selectedBackgroundColor : feri.ui.selectedBackgroundColor
      });

      data.push(sessionRow);
    }

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("Nastavitve board edit window");
    }

    // create main day window
    var listWindow = Titanium.UI.createWindow({
      id : 'listWindow',
      barColor : feri.ui.barColor,
      backgroundColor : feri.ui.backgroundColor,
      fullscreen : false,
      title : w.title
    });

    var tableview = Titanium.UI.createTableView({
      data : data,
      editable : true,
      allowsSelectionDuringEditing : true
    });

    if (!feri.isAndroid()) {

      var edit = Titanium.UI.createButton({
        title : lang['uredi']
      });

      edit.addEventListener('click', function() {
        listWindow.setRightNavButton(cancel);
        tableview.editing = true;
      });

      var cancel = Titanium.UI.createButton({
        title : lang['preklici'],
        style : Titanium.UI.iPhone.SystemButtonStyle.DONE
      });
      cancel.addEventListener('click', function() {
        listWindow.setRightNavButton(edit);
        tableview.editing = false;
      });

      listWindow.setRightNavButton(edit);

    }

    listWindow.add(tableview);

    // event listeners
    // add delete event listener
    tableview.addEventListener('delete', function(e) {
      deleteFromList(e);
    });

    // delete for android
    if (feri.isAndroid()) {
      tableview.addEventListener('click', function(e) {
        if (e.row.uid == undefined || e.row.uid == 0)
          return;

        var a = Titanium.UI.createAlertDialog({
          message : lang['izbrisi_iz_seznama']
        });
        a.buttonNames = ['OK', lang['preklici']];
        a.cancel = 1;
        a.show();

        a.addEventListener('click', function(f) {
          if (f.index == 0)
            deleteFromList(e);
        });
      });
    }

    function deleteFromList(e) {
      // getting entity from db
      var catData = Database.entity.db('main', 'board_children').load(e.row.uid);

      if (w.edit == 'favorites')
        catData.favourite = false;
      else if (w.edit == 'push')
        catData.push = false;

      Database.entity.db('main', 'board_children').save(catData, true);

      if (feri.isAndroid()) {
        tableview.deleteRow(e.index);
      }

      if (w.edit == 'push')
        feri.unsubscribeToServerPush(e.row.uid);

      return true;
    }

    return listWindow;
  };

})(); 