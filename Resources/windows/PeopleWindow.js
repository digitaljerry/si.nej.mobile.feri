(function() {

  feri.ui.createPeopleWindow = function() {

    if (feri.testflight == true && !feri.isAndroid()) {
      testflight.passCheckpoint("People window");
    }

    var PeopleWindow = Titanium.UI.createWindow({
      id : 'peopleWindow',
      title : lang['win_people'],
      backgroundColor : feri.ui.backgroundColor,
      barColor : feri.ui.barColor,
      fullscreen : false
    });

    // Create the table view
    var tableview = Titanium.UI.createTableView({
      backgroundColor : feri.ui.backgroundColor,
      filterAttribute : 'search'
    });

    // make it searchable
    feri.getSearchbar(tableview);

    var index = [];
    var count = 0;

    PeopleWindow.doRefresh = function() {
      var nameList = getNameList();

      var headerLetter = '';
      var presenterRow = [];
      var data = [];
      for (var i in nameList) {
        var user = nameList[i].split(':');
        var uid = parseInt(user[1]) + 0;
        var fullName = user[0] + '';

        var shortName = user[2] + '';
        var name = shortName;
        if (fullName.charAt(fullName.length - 2) == ',') {
          fullName = fullName.slice(0, fullName.length - 2);
        } else {
          name = fullName;
        }

        presenterRow = Ti.UI.createTableViewRow({
          hasChild : feri.isAndroid(),
          className : 'people_row',
          search : name,
          uid : uid,
          height : 40,
          selectedBackgroundColor : feri.ui.selectedBackgroundColor
        });

        if (fullName == shortName) {
          fullName = '';
        } else {
          fullName = feri.cleanSpecialChars(fullName);
          var firstLastName = fullName.split(', ');
          fullName = firstLastName[1] + ' ' + firstLastName[0];
          shortName = "(" + shortName + ")";
          var lastName = firstLastName[0];
          var firstName = firstLastName[1];
        }

        if (feri.isAndroid()) {
          presenterRow.add(Ti.UI.createLabel({
            text : fullName,
            fontFamily : 'sans-serif',
            font : {
              fontWeight : 'bold'
            },
            left : (fullName != '') ? 9 : 0,
            height : 40,
            color : feri.ui.darkText,
            touchEnabled : false
          }));
        } else {
          if (fullName != '') {
            var nameView = Ti.UI.createView({
              height : 40,
              layout : 'horizontal'
            });

            var firstNameLabel = Ti.UI.createLabel({
              text : firstName,
              font : 'Helvetica',
              left : 10,
              height : 40,
              width : 'auto',
              color : feri.ui.darkText,
              touchEnabled : false
            });
            nameView.add(firstNameLabel);

            var lastNameLabel = Ti.UI.createLabel({
              text : lastName,
              font : 'Helvetica-Bold',
              left : 5,
              height : 40,
              width : 'auto',
              color : feri.ui.darkText,
              touchEnabled : false
            });
            nameView.add(lastNameLabel);
            presenterRow.add(nameView);
          }
        }

        // If there is a new last name first letter, insert a header in the table.
        if (headerLetter == '' || name.charAt(0).toUpperCase() != headerLetter) {
          headerLetter = name.charAt(0).toUpperCase();
          //data.push(feri.ui.createHeaderRow(headerLetter));
          presenterRow.header = headerLetter;
          index.push({
            title : headerLetter,
            index : count
          });
        }

        count++;
        data.push(presenterRow);
      }

      ////
      tableview.index = index;
      ////

      tableview.setData(data);
    };

    PeopleWindow.doRefresh();
    Ti.App.addEventListener('refresh:people', function() {
      PeopleWindow.doRefresh();
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {

      if (!e.rowData.uid) {
        return;
      }

      if (feri.useDashboard) {
        feri.navGroup.open(feri.ui.createPeopleDetailWindow({
          title : e.rowData.name,
          uid : e.rowData.uid,
          name : e.rowData.name
        }), {
          animated : true
        });
      } else {
        feri.tabPeople.open(feri.ui.createPeopleDetailWindow({
          title : e.rowData.name,
          uid : e.rowData.uid,
          name : e.rowData.name
        }), {
          animated : true
        });
      }
    });

    // add table view to the window
    PeopleWindow.add(tableview);

    // android back button listener
    if (feri.isAndroid()) {
      PeopleWindow.addEventListener('android:back', function() {
        feri.navGroup.close(feri.iconWin, {
          animated : true
        });
        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;
      });

      var activity = PeopleWindow.activity;
      activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
        var menuItemRefresh = menu.add({
          title : 'Osveži'
        });
        menuItemRefresh.addEventListener("click", function(e) {
          Ti.App.fireEvent('feri:update_data_zaposleni');
        });
      };
    }

    return PeopleWindow;
  };

  function getNameList() {
    var conn = Database.db.getConnection('main');
    var rows = conn.query("SELECT uid, name, full_name, surname FROM user ORDER BY surname ASC");
    var nameList = [];

    if (rows) {
      while (rows.isValidRow()) {
        var uid = rows.fieldByName('uid');
        var lastName = rows.fieldByName('surname');
        var firstName = rows.fieldByName('name');
        nameList.push(lastName + ', ' + firstName + ':' + uid + ':' + firstName);

        rows.next();
      }
      rows.close();
    }

    return nameList;
  }

})(); 