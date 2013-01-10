feri.ui.activityIndicator = (function() {
  var activityIndicator;
  var isShowing = false;
  var myTimeout = undefined;

  if (feri.isAndroid()) {
    activityIndicator = Ti.UI.createActivityIndicator({
      color : '#fff'
    });
  } else {
    var activityIndicator = Ti.UI.createWindow({
      modal : false,
      navBarHidden : true,
      touchEnabled : true
    });
    activityIndicator.orientationModes = [Ti.UI.PORTRAIT];
    var view = Ti.UI.createView({
      backgroundColor : '#000',
      height : '100%',
      width : '100%',
      opacity : 0.65
    });
    var ai = Ti.UI.createActivityIndicator({
      style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
      color : '#fff'
    });
    activityIndicator.ai = ai;
    activityIndicator.add(view);
    activityIndicator.add(ai);
  }

  activityIndicator.showModal = function(message, timeout, timeoutMessage) {

    // check for connectivty
    if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
      var alertDialog = Ti.UI.createAlertDialog({
        title : lang['napaka'],
        message : lang['no_connection'],
        buttonNames : ['OK']
      });
      alertDialog.show();
      return;
    }

    if (isShowing) {
      return;
    }
    isShowing = true;
    if (feri.isAndroid()) {
      activityIndicator.message = message;
      activityIndicator.show();
    } else {
      activityIndicator.ai.message = message;
      activityIndicator.ai.show();
      activityIndicator.open({
        animated : false
      });
    }

    if (timeout) {
      myTimeout = setTimeout(function() {
        activityIndicator.hideModal();
        if (timeoutMessage) {
          var alertDialog = Ti.UI.createAlertDialog({
            title : lang['napaka'],
            message : timeoutMessage,
            buttonNames : ['OK']
          });
          alertDialog.show();
        }

        // re-enabling the icons on the dashboard
        feri.dashboardActive = true;

      }, timeout);
    }
  };

  activityIndicator.hideModal = function() {
    if (myTimeout !== undefined) {
      clearTimeout(myTimeout);
      myTimeout = undefined;
    }
    if (isShowing) {
      isShowing = false;
      if (feri.isAndroid()) {
        activityIndicator.hide();
      } else {
        activityIndicator.ai.hide();
        activityIndicator.close({
          animated : false
        });
      }
    }
  }

  return activityIndicator;
})(); 