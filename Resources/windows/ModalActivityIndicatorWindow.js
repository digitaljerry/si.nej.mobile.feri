feri.ui.activityIndicator = (function() {
  var activityIndicator;
  var isShowing = false;
  var myTimeout = undefined;
  
  var activityIndicator = Ti.UI.createWindow({
    modal : false,
    navBarHidden : true,
    touchEnabled : true,
    tintColor: '#ffffff',
    navTintColor: '#ffffff'
  });
  activityIndicator.orientationModes = [Ti.UI.PORTRAIT];
  var view = Ti.UI.createView({
    backgroundColor : '#000',
    height : '100%',
    width : '100%',
    opacity : 0.7
  });
  var ai = Ti.UI.createActivityIndicator({
    color : '#fff'
  });
  
  if (!feri.isAndroid()) {
    ai.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
  }
  
  activityIndicator.ai = ai;
  activityIndicator.add(view);
  activityIndicator.add(ai);

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
    
    // android dirty fix
    if (feri.isAndroid()) {
      return;
    } else {
      
      if (isShowing) {
        return;
      }
      
      isShowing = true;
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
    
    // android dirty fix
    if (feri.isAndroid()) {
      return;
    }
    
    if (isShowing) {
      isShowing = false;
      activityIndicator.ai.hide();
      activityIndicator.close({
        animated : false
      });
    }
  }

  return activityIndicator;
})(); 