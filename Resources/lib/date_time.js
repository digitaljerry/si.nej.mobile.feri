(function($){
	var _format_date_time = "";
	var _msg_invalid_date = "";
		
	
	/**
	 * Setiranje variabl
	 * 
	 */
	$.fn.init_datetime = function (json_data){
		_format_date_time = json_data.date_time_format;
		_msg_invalid_date = json_data.str_invaliddate;
	}
	
	/**
	 * Formatiranje datuma d.m.y v format iz nastavitev
	 * 
	 * Format je vedno sestavljen iz DD.MM.YYYY   -- edino zaporedje je lahko drugacno in drugo je locilo.
	 * Dan je vedno sestavljen iz dveh znakov
	 * Mesec iz 2 znakov
	 * Leto iz 4 znakov
	 * 
	 */
	$.fn.format_date = function (strDate, dateSeparator){
		// ASP NE PODPIRA FORMATIRANJA !
		if(getProjectVariant() == 'asp'){
				return strDate;
		}
		
		var format_date_time = _format_date_time;
		var date_arr;

		date_arr = parse_myd_date(strDate, dateSeparator);

//		 v primeru napacnega datuma, se se enkrat klice parsanje datuma in se mu poda trenutni datum
		if(date_arr == null) {
			var today_date = new Date();			
			var curr_date = today_date.getDate();
			var curr_month = today_date.getMonth() + 1;
			var curr_year = today_date.getFullYear();
			
			strDate = curr_date + dateSeparator + curr_month + dateSeparator + curr_year;
			date_arr = parse_myd_date(strDate, dateSeparator);
		}

		//	Uro se odstrani iz formata
		format_date_time = date_format_only(format_date_time);
		
		format_date_time = format_date_time.replace("DD", date_arr[0]);
		format_date_time = format_date_time.replace("MM", date_arr[1]);
		format_date_time = format_date_time.replace("YYYY", date_arr[2]);
		
		return format_date_time;	
	}
	
	/**
	 * Iz formata se odstrani uro
	 * 
	 * @param format_date_time
	 * @return
	 */
	function date_format_only(format_date_time){
		format_date_time = format_date_time.replace("hh", "");
		format_date_time = format_date_time.replace("mm", "");
		format_date_time = format_date_time.replace("ss", "");
		format_date_time = format_date_time.replace(":", "");
		format_date_time = format_date_time.replace(":", "");
		
		format_date_time = jQuery.trim(format_date_time);
		return format_date_time;
	}
	
	/**
	 * 	Formatiranje datuma, ki je zapisan v setup nazaj v m.d.y
	 * 
	 * return_type  => date, string
	 * ret_null = true in vrne nazaj ob napacnem datumu NULL, drgac pa danasnji datum
	 * 
	 */
	$.fn.format_date_to_dmy = function (strDate, dateSeparator, format_date_time, return_type, ret_null){
		// ASP NE PODPIRA FORMATIRANJA !
		if(getProjectVariant() == 'asp'){
				return strDate;
		}
		var ret_date;
		var correct_date = true;
		var day;
		var month;
		var year;
		
		var arr_date = is_corect_date(strDate, dateSeparator, format_date_time);
		
		if(arr_date == null){
			correct_date = null;
		}
		else{
			day = arr_date[0];
			month = arr_date[1];
			year = arr_date[2];
		}

		//	Sestavljanje datuma
		ret_date = create_date_dmy(day, month, year, dateSeparator, ret_null, return_type, correct_date);

		return ret_date;		
	}
	
	/**
	 * Preverjanje ce ima element datum, ki se ujema z nastavitvami
	 * Vracanje NULL ce datum ni tak kot je nastavljen v nastavitvah
	 */
	$.fn.check_is_date = function (dateSeparator) {				
		var is_date = is_corect_date($(this).val(), dateSeparator, null);

		if(is_date == null){
			var date_time = _format_date_time;
			var setup_date_time_format = date_format_only(date_time); 
			// Javljanje obvestila v primeru napacnega datuma
			alert(_msg_invalid_date+' '+setup_date_time_format+' !');
			return false;
		}
		return true;
	}
	
	
	/**
	 * 	Preverjanje ce je datum res tak kot v nastavitvah.
	 *  Ce je ustrazno se vrne array z 
	 * 	[0]=day
	 * 	[1]=month
	 * 	[2]=year
	 * 
	 * 	drgac NULL
	 * 
	 * 	return_type  => date, string
	 * 	ret_null = true in vrne nazaj ob napacnem datumu NULL, drgac pa danasnji datum 
	 */
	function is_corect_date(strDate, dateSeparator, format_date_time){		
		var ret_date = new Array();
		var correct_date = true;
		
		// ce gre za ASP se ne uposteva formatiranja datuma !!!
		if(getProjectVariant() == 'asp'){
			if(isDate(strDate, '.'))
				return strDate;
		}

		if(format_date_time == null)
			format_date_time = _format_date_time;
		
		strDate = jQuery.trim(strDate);		

		// Pozicije znakov formatiranja
		var dd_position = format_date_time.indexOf('DD');
		var mm_position = format_date_time.indexOf('MM');
		var yyyy_position = format_date_time.indexOf('YYYY');
	
		// celotna velikost datuma mora biti tocno 10
		if(strDate.length != 10)
			correct_date = false;
		
		// vsako stevilo ima tocno doloceno st. znakov
		var day = strDate.substr(dd_position,  2);
		var month = strDate.substr(mm_position, 2);
		var year = strDate.substr(yyyy_position, 4);
		
		
// So izrazani deli res cela stevila
		if(isInteger(day)==false || isInteger(month)==false || isInteger(year)==false)
			correct_date = false;
		
		if(correct_date == false)
			return null;
		
		ret_date[0] = day;
		ret_date[1] = month;
		ret_date[2] = year;
		return ret_date; 
	}


	/**
	 * Kreiranje datuma tipa d.m.y
	 * 
	 * @param day
	 * @param month
	 * @param year
	 * @param dateSeparator		locilo pri izdelavi datuma
	 * @param ret_null			V primeru napake vrni NULL ?
	 * @param return_type		vrne kot string ali kot objekt datum  - [date, string]
	 * @param correct_date		so podatki res ustrezni za kreiranje datuma
	 */
	function create_date_dmy(day, month, year, dateSeparator, ret_null, return_type, correct_date){		
		if(correct_date == false){
			if(ret_null == true)
				return null;
			
			var today_date = new Date();			
			day = today_date.getDate();
			month = today_date.getMonth();
			year = today_date.getFullYear();
		}
		
		// vracanje kot objekt datum
		if(return_type == 'date'){
			ret_date	= new Date();
			ret_date.setFullYear(year, month, day);
		}
		// vracanje kot string
		else {
			ret_date = day + dateSeparator + month + dateSeparator + year;
		}	
		return ret_date;
	}
	
	/****
	 * Preverjanje ce gre za cela stevila
	 */
	function isInteger(number) {
		var correct_date = true;
				
//		stevilom se pogleda ce slucajno vsebujejo decimalno piko in ce so res stevila		
		var is_number = number.indexOf('.');
		
		// Gre za decimalno stevilo - to se vedno spada pod stevila (NaN) zato se obdela zase
		if(is_number != -1)
			correct_date = false;

		// Se preverjanje ce gre res za stevilo
		if(isNaN(is_number)) 
			correct_date = false;
		
		return correct_date;
	}
	
	
	
	/**
	 * 	Parsanje datuma ki je formatiran kot : d.m.y
	 * Ce je ustrazno se vrne array z 
	 * [0]=day
	 * [1]=month
	 * [2]=year
	 * 
	 * drgac NULL
	 */
	function parse_myd_date (strDate, dateSeparator){		

		if (strDate.indexOf(dateSeparator) == -1)
		{
			return null;
		}

		var arr = strDate.split(dateSeparator, 3);
		if (arr.length != 3)
		{
			return null;
		}

		var day  = arr[0];
		var month = arr[1];
		var year  = arr[2];
		
		// dodajanje predhodne stevilke v primeru kratkega zapisa(to se zgodi ko dnevu ali mescu dodajas, odstevas vrednosti in se 
//		potem pretvori v enomestno stevilo
		if(day.length == 1)
			day = "0"+day;
		if(month.length == 1)
			month = "0"+month;
		
		if(day.length != 2 || month.length != 2 || year.length != 4 ){
			return null;
		}
		
		var date_arr = new Array(); 
		date_arr[0]=day;       
		date_arr[1]=month;
		date_arr[2]=year;
		
		return date_arr;
	}
	
	
})(jQuery);