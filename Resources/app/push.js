(function() {
	
	//LOGIN TO CLOUD AS A USER THAT WE CREATED BEFORE
	feri.login = function(returnToken) {

		var username = 'mobile';
		var password = 'password';
		var Cloud = require('ti.cloud');
		
		Cloud.Users.login({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				/*trace(	'Success:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);*/
			} else {
				/*trace(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));*/
			}
		});
	};

	//LOGOUT
	feri.logout = function() {

		var username = 'mobile';
		var password = 'password';
		var Cloud = require('ti.cloud');

		Cloud.Users.logout({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				/*trace(	'Success logging out:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);*/
				Ti.App.Properties.setString("push_username", null);
			} else {
				/*trace(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));*/
			}
		});
	};
	
	feri.registerForPush = function(returnToken) {
		//alert('feri.registerForPush');
		
		var user_device_token = null;
		
		if ( feri.isAndroid() ) {
		
			var CloudPush = require('ti.cloudpush');
			
			CloudPush.retrieveDeviceToken({
				success: function deviceTokenSuccess(e) {
					//alert('should work ' + e.deviceToken);
					user_device_token = e.deviceToken;
					Ti.App.Properties.setString("device_token",user_device_token);
					Ti.App.Properties.setString("push",'true');
			 	},
			    error: function deviceTokenError(e) {
			    	//alert('Failed to register for push! ' + e.error);
			    }
			});
			
			CloudPush.debug = false;
			CloudPush.enabled = true;
			CloudPush.showTrayNotificationsWhenFocused = true;
			CloudPush.showTrayNotification = true;
			CloudPush.focusAppOnPush = false;
			
			CloudPush.addEventListener('callback', function (evt) {
				//alert('Callback: ' + evt.payload);
				Ti.App.fireEvent('feri:update_data_oglasna');
		  });
		  CloudPush.addEventListener('trayClickLaunchedApp', function (evt) {
		    //alert('Tray Click Launched App (app was not running)');
		  });
		  CloudPush.addEventListener('trayClickFocusedApp', function (evt) {
		    //alert('Tray Click Focused App (app was already running)');
		  });
			
		} else {
			
			Ti.Network.registerForPushNotifications({
				types: [
					Titanium.Network.NOTIFICATION_TYPE_BADGE,
					Titanium.Network.NOTIFICATION_TYPE_ALERT,
					Titanium.Network.NOTIFICATION_TYPE_SOUND
				],
				success:function(e)
				{
					user_device_token = e.deviceToken;
					Ti.App.Properties.setString("device_token",user_device_token);
					Ti.App.Properties.setString("push",'true');
					//alert("Device token received "+user_device_token);
				},
				error:function(e)
				{
					//alert("Error during registration: "+e.error);
				},
				callback:function(e)
				{
					// called when a push notification is received.
					//alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
					Ti.App.fireEvent('feri:update_data_oglasna');
				}
			});
			
		}
		
		if ( returnToken == true )
			return user_device_token;
	}
	
	feri.unregisterForPush = function() {
		//alert('feri.unregisterForPush');
		
		var user_device_token = null;
		Ti.App.Properties.setString("push",'false');
		
		if ( feri.isAndroid() ) {
		
			var CloudPush = require('ti.cloudpush');
			
			CloudPush.retrieveDeviceToken({
				success: function deviceTokenSuccess(e) {
					//alert('unregistered ' + e.deviceToken);
					user_device_token = e.deviceToken;
					Ti.App.Properties.setString("device_token",user_device_token);
					Ti.App.Properties.setString("push",'false');
			 	},
			    error: function deviceTokenError(e) {
			    	//alert('Failed to register for push! ' + e.error);
			    }
			});
			
			CloudPush.enabled = false;
			
		} else {
			
			Ti.Network.unregisterForPushNotifications({
				types: [
					Titanium.Network.NOTIFICATION_TYPE_BADGE,
					Titanium.Network.NOTIFICATION_TYPE_ALERT,
					Titanium.Network.NOTIFICATION_TYPE_SOUND
				],
				success:function(e)
				{
					user_device_token = e.deviceToken;
					Ti.App.Properties.setString("device_token",user_device_token);
					Ti.App.Properties.setString("push",'false');
					//alert("Device unregistered "+user_device_token);
				},
				error:function(e)
				{
					//alert("Error during unregistration: "+e.error);
				},
				callback:function(e)
				{
					// called when a push notification is received.
					//alert("Received a push notification \n\nPayload:\n\n"+JSON.stringify(e.data));
					Ti.App.fireEvent('feri:update_data_oglasna');
				}
			});
			
		}
	}
	
	feri.subscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( Ti.App.Properties.getString("device_token") == null )
			token = feri.registerForPush(true);
		
		if (channel == null)
			channel = 'global';
		
		if ( feri.isAndroid() ) {
			
			var Cloud = require('ti.cloud');
			
			Cloud.PushNotifications.subscribe({
				channel: channel,
				type:'android',
				device_token: token
			}, function (e) {
				if (e.success) {
					//alert('Success'+((e.error && e.message) || JSON.stringify(e)));
					return true;
				} else {
					//alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
					return false;
				}
			});
			
		} else {
			
			var Cloud = require('ti.cloud');
			
			Cloud.PushNotifications.subscribe({
				channel: channel,
				type:'ios',
				device_token: token
			}, function (e) {
				if (e.success) {
					//alert('Success'+((e.error && e.message) || JSON.stringify(e)));
					return true;
				} else {
					//alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
					return false;
				}
			});
			
		}
	}
	
	feri.unsubscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( Ti.App.Properties.getString("device_token") == null )
			token = feri.registerForPush(true);
		
		if (channel == null)
			channel = 'global';
		
		if ( feri.isAndroid() ) {
			
			var Cloud = require('ti.cloud');
			
			Cloud.PushNotifications.unsubscribe({
				channel: channel,
				type:'android',
				device_token: token
			}, function (e) {
				if (e.success) {
					//alert('Success'+((e.error && e.message) || JSON.stringify(e)));
					return true;
				} else {
					//alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
					return false;
				}
			});
			
		} else {
			
			var Cloud = require('ti.cloud');
			
			Cloud.PushNotifications.unsubscribe({
				channel: channel,
				type:'ios',
				device_token: token
			}, function (e) {
				if (e.success) {
					//alert('Success'+((e.error && e.message) || JSON.stringify(e)));
					return true;
				} else {
					//alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
					return false;
				}
			});
			
		}
	}
	
	feri.login();
	
	// GET TOKEN IF NO ALREADY STORED
	var user_device_token = Ti.App.Properties.getString("device_token",null);
	var push = Ti.App.Properties.getString("push",null);
	if ( user_device_token == null && push != 'false' )
		feri.registerForPush();
	
})();