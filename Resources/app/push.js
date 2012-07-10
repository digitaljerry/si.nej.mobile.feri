(function() {
	
	var Cloud = require('ti.cloud');
	var trace = Ti.API.info;
	var user_device_token = Ti.App.Properties.getString("device_token",null);
	var username = Ti.App.Properties.getString("push_username", null);
	var password = 'pusher';
	
	if ( username == null ) {
		registerUser();
		login();
	} else {
		login();
	}
	
	//REGISTER USER ON CLOUD
	function registerUser(){
		trace("REGISTER");
		
		// if username is null, generate it
		if ( username == null ) {
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
				alert("USER CREATED SUCCESSFULLY.");
				// user created successfully
				Ti.App.Properties.setString("push_username", username);
			} else {
				// oops, something went wrong
				alert("USER not created. something went wrong "+e);
			}
		});
		
		Ti.App.Properties.setString("push_username", null);
	}
	
	//LOGIN TO CLOUD AS A USER THAT WE CREATED BEFORE
	function login(){
		Cloud.Users.login({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				alert(	'Success:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);
			} else {
				alert(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));
			}
		});
	}
	
	//LOGOUT
	function logout(){
		Cloud.Users.logout({
			login: username,
			password: password
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				alert(	'Success logging out:\\n' +
						'id: ' + user.id + '\\n' +
						'first name: ' + user.first_name + '\\n' +
						'last name: ' + user.last_name);
				Ti.App.Properties.setString("push_username", null);
			} else {
				alert(	'Error:\\n' +
						((e.error && e.message) || JSON.stringify(e)));
			}
		});
	}
	
	//REGISTER LOCAL PUSH NOTIFICATION HERE
	function getDeviceToken(){
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
				alert("Device token received "+user_device_token);
			},
			error:function(e)
			{
				alert("Error during registration: "+e.error);
			},
			callback:function(e)
			{
				// called when a push notification is received.
				alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
			}
		});
	}
	
	//REGISTER SERVER PUSH
	feri.subscribeToServerPush = function (channel) {
		
		if (channel == null)
			channel = 'global';
		
		Cloud.PushNotifications.subscribe({
			channel: channel,
			type:'ios',
			device_token: user_device_token
		}, function (e) {
			if (e.success) {
				alert('Success'+((e.error && e.message) || JSON.stringify(e)));
				return true;
			} else {
				alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				return false;
			}
		});
	}
	
	//UNREGISTER SERVER PUSH
	feri.unsubscribeToServerPush = function (channel) {
		
		if (channel == null)
			channel = 'global';
		
		Cloud.PushNotifications.unsubscribe({
			channel: channel,
			type:'ios',
			device_token: user_device_token
		}, function (e) {
			if (e.success) {
				alert('Success'+((e.error && e.message) || JSON.stringify(e)));
				return true;
			} else {
				alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				return false;
			}
		});
	}
	
})();