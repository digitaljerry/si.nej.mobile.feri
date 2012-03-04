var feri = {
	android: {
		menu: {}	
	},
	datetime: {},
    ui: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined,
    navGroup: undefined,
    updateTimeout: 25000,
    loadTimeout: 10000
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
	
	feri.is_int = function(value) { 
	  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
	      return true;
	  } else { 
	      return false;
	  } 
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
	
	feri.getWebcontrols = function(window, webview) {
		// web controls
		var bb2 = Titanium.UI.createButtonBar({
			labels:['Back', 'Reload', 'Forward'],
			backgroundColor:'#003'
		});
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		// TODO
		if ( !feri.isAndroid ) {
			window.setToolbar([flexSpace,bb2,flexSpace]);
		} else {}
		
		webview.addEventListener('load',function(e)
		{
			Ti.API.debug("url = "+webview.url);
			Ti.API.debug("event url = "+e.url);
		});
		bb2.addEventListener('click',function(ce)
		{
			if (ce.index == 0)
			{
				webview.goBack();
			}
			else if (ce.index == 1)
			{
				webview.reload();
			}
			else
			{
				webview.goForward();
			}
		});
	}
	
	feri.getSearchbar = function(tableview) {
		// search bar
		var search = Titanium.UI.createSearchBar({
			barColor:'#414444',
			showCancel:false,
			hintText:'search'
		});
		
		search.addEventListener('change', function(e)
		{
			e.value; // search string as user types
		});
		
		search.addEventListener('return', function(e)
		{
			search.blur();
		});
		
		search.addEventListener('cancel', function(e)
		{
			search.blur();
		});
		
		tableview.search = search;
		tableview.searchHidden = true;
	}
	
})();