(function() {
	
	//REGISTER USER ON CLOUD
	Ti.App.addEventListener('feri:registerUser', function (e) {
		//alert("REGISTER");
		
		var username = Ti.App.Properties.getString("push_username");
		var password = 'pusher';
		
		// if username is null, generate it
		if ( username == null ||
			 username == '' ) {
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 8;
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			username = 'user_' + randomstring + '@uni-mb.si';
		}
		
		Cloud.Users.create({
			username: username,
			password: password,
			password_confirmation: password,
			first_name: "Pusher",
			last_name: username
		}, function (e) {
			if (e.success) {
				//alert("USER CREATED SUCCESSFULLY.");
				// user created successfully
				Ti.App.Properties.setString("push_username", username);
				Ti.App.fireEvent("feri:login");
				
			} else {
				// oops, something went wrong
				//alert("USER not created. something went wrong "+e);
				Ti.App.Properties.setString("push_username", null);
			}
		});
	});
	
	//LOGIN TO CLOUD AS A USER THAT WE CREATED BEFORE
	Ti.App.addEventListener('feri:login', function (e) {
		
		var username = Ti.App.Properties.getString("push_username");
		var password = 'pusher';
		
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
	});
	
	//LOGOUT
	Ti.App.addEventListener('feri:logout', function(e){
		
		var username = Ti.App.Properties.getString("push_username");
		var password = 'pusher';
		
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
	});
	
	//REGISTER LOCAL PUSH NOTIFICATION HERE
	feri.getDeviceToken = function (){
		//alert("REGISTERING LOCAL PUSH");
		
		if ( feri.isAndroid() ) {
			
			var deviceid;
			var CloudPush = require('ti.cloudpush');
			CloudPush.debug = false;
			CloudPush.enabled = true;
			CloudPush.showTrayNotificationsWhenFocused = true;
			CloudPush.focusAppOnPush = false;
			
			
			var deviceToken;
			
			var Cloud = require('ti.cloud');
			Cloud.debug = true;
			
			CloudPush.retrieveDeviceToken({
				success: function deviceTokenSuccess(e) {
					//alert('Device Token: ' + e.deviceToken);
					user_device_token = e.deviceToken;
					Ti.App.Properties.setString("device_token",user_device_token);
			 	},
			    error: function deviceTokenError(e) {
			    	//loginDefault();
			    	//alert('Failed to register for push! ' + e.error);
			    }
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
				}
			});
			
		}
	}
	
	//REGISTER SERVER PUSH
	feri.subscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( Ti.App.Properties.getString("device_token") == null )
			return false;
		
		if (channel == null)
			channel = 'global';
		
		if ( feri.isAndroid() ) {
			
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
	
	//UNREGISTER SERVER PUSH
	feri.unsubscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( token == null )
			return false;
		
		if (channel == null)
			channel = 'global';
		
		if ( feri.isAndroid() ) {
			
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
	
	// check if we have a user and then try to subscribe for push notifications
	var Cloud = require('ti.cloud');
	var trace = Ti.API.info;
	var user_device_token = Ti.App.Properties.getString("device_token",null);
	
	if ( user_device_token == null )
		feri.getDeviceToken();
	
	var username = Ti.App.Properties.getString("push_username");
	// if no user, first register
	// do we even need login?
	if ( username == null ) {
		Ti.App.fireEvent("feri:registerUser", {'login': true});
	} else {
		Ti.App.fireEvent("feri:login");
	}
	
})();