(function() {
	
	//REGISTER USER ON CLOUD
	Ti.addEventListener('feri:registerUser', function (e) {
		trace("REGISTER");
		
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
				trace("USER CREATED SUCCESSFULLY.");
				// user created successfully
				Ti.App.Properties.setString("push_username", username);
				Ti.fireEvent("feri:login");
				
			} else {
				// oops, something went wrong
				trace("USER not created. something went wrong "+e);
				Ti.App.Properties.setString("push_username", null);
			}
		});
	});
	
	//LOGIN TO CLOUD AS A USER THAT WE CREATED BEFORE
	Ti.addEventListener('feri:login', function (e) {
		
		var username = Ti.App.Properties.getString("push_username");
		var password = 'pusher';
		
		Cloud.Users.login({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				trace(	'Success:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);
			} else {
				trace(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));
			}
		});
	});
	
	//LOGOUT
	Ti.addEventListener('feri:logout', function(e){
		
		var username = Ti.App.Properties.getString("push_username");
		var password = 'pusher';
		
		Cloud.Users.logout({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				trace(	'Success logging out:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);
				Ti.App.Properties.setString("push_username", null);
			} else {
				trace(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));
			}
		});
	});
	
	//REGISTER LOCAL PUSH NOTIFICATION HERE
	feri.getDeviceToken = function (){
		trace("REGISTERING LOCAL PUSH");
		
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
				trace("Device token received "+user_device_token);
			},
			error:function(e)
			{
				trace("Error during registration: "+e.error);
			},
			callback:function(e)
			{
				// called when a push notification is received.
				trace("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
			}
		});
	}
	
	//REGISTER SERVER PUSH
	feri.subscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( Ti.App.Properties.getString("device_token") == null )
			return false;
		
		if (channel == null)
			channel = 'global';
		
		Cloud.PushNotifications.subscribe({
			channel: channel,
			type:'ios',
			device_token: token
		}, function (e) {
			if (e.success) {
				trace('Success'+((e.error && e.message) || JSON.stringify(e)));
				return true;
			} else {
				trace('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				return false;
			}
		});
	}
	
	//UNREGISTER SERVER PUSH
	feri.unsubscribeToServerPush = function (channel) {
		
		var token = Ti.App.Properties.getString("device_token");
		
		if ( token == null )
			return false;
		
		if (channel == null)
			channel = 'global';
		
		Cloud.PushNotifications.unsubscribe({
			channel: channel,
			type:'ios',
			device_token: token
		}, function (e) {
			if (e.success) {
				trace('Success'+((e.error && e.message) || JSON.stringify(e)));
				return true;
			} else {
				trace('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				return false;
			}
		});
	}
	
	// check if we have a user and then try to subscribe for push notifications
	if ( !feri.isAndroid() ) {
		
		var Cloud = require('ti.cloud');
		var trace = Ti.API.info;
		var user_device_token = Ti.App.Properties.getString("device_token",null);
		var username = Ti.App.Properties.getString("push_username");
		
		// if no user, first register
		if ( username == null ) {
			Ti.fireEvent("feri:registerUser", {'login': true});
		} else {
			Ti.fireEvent("feri:login");
		}
	
	}
	
})();