var feri = {
	android: {
		menu: {}	
	},
	datetime: {},
    ui: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined,
    navGroup: undefined
};

(function() {
	feri.extend = function(obj) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    for (var i = 0; i < args.length; i++) {
	    	var source = args[i];
	      	for (var prop in source) {
	        	if (source[prop] !== void 0) obj[prop] = source[prop];
	      	}
	    }
	    return obj;
	};
	
	feri.isLargeScreen = function() {
		if (feri.__isLargeScreen === undefined) {
			feri.__isLargeScreen = (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return feri.__isLargeScreen;
	};
	
	feri.isAndroid = function() {
		if (feri.__isAndroid === undefined) {
			feri.__isAndroid = (Ti.Platform.osname == 'android');
		}
		return feri.__isAndroid;
	}
	
	feri.cleanSpecialChars = function(str) {
  		if (str == null) {
    		return '';
  		}
  		if (typeof str === 'string') {
    		return  str
      			.replace(/&quot;/g,'"')
      			.replace(/\&amp\;/g,"&")
      			.replace(/&lt;/g,"<")
      			.replace(/&gt;/g,">")
      			.replace(/&#039;/g, "'");
  		}
  		return '';
	};
	
	feri.trim = function(str) {
		return str.replace(/^\s+|\s+$/g,"");
	}
	feri.ltrim = function(str) {
		return str.replace(/^\s+/,"");
	}
	feri.rtrim = function(str) {
		return str.replace(/\s+$/,"");
	}
	
	feri.android.menu = {
		data: [],
		init: function(params) {
			var activity = params.win.activity; 
	        activity.onCreateOptionsMenu = function (e) {
	          	var optionsmenu = e.menu;
	          	for (k = 0; k < params.buttons.length; k++) {
	            	feri.android.menu.data[k] = optionsmenu.add({
	              		title: params.buttons[k].title
	            	});
	            	feri.android.menu.data[k].addEventListener("click", params.buttons[k].clickevent);
	          	}
	        };
		}
	};
})();