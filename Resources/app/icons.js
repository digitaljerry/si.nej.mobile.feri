(function() {
	var iconHeight = 122;
	var iconWidth = 107;
	var imageSuffix = '';
	
	if (feri.isLargeScreen()) {
		iconHeight = 243;
		iconWidth = 213;
		imageSuffix = '@2x';
	} 
	
	feri.ui.icons = {
		height: iconHeight,
		width: iconWidth,
		list: [
			{
				image: '/images/dashboard/oglasna' + imageSuffix + '.png',
				func: feri.ui.createBoardWindow,
				name: 'board',
				refresh: true
			},
			{
				image: '/images/dashboard/urniki' + imageSuffix + '.png',
				func: feri.ui.createUrnikiWindow,
				urniki: true
			},
			{
				image: '/images/dashboard/zaposleni' + imageSuffix + '.png',
				func: feri.ui.createPeopleWindow,
				name: 'people',
				refresh: true
			},
			{
				image: '/images/dashboard/zemljevid' + imageSuffix + '.png',
				func: feri.ui.createMapWindow
			},
			{
				image: '/images/dashboard/diplome' + imageSuffix + '.png',
				func: feri.ui.createDiplomeWindow,
				name: 'diplome',
				refresh: true
			},
			{
				image: '/images/dashboard/informacije' + imageSuffix + '.png',
				func: feri.ui.createInformacijeWindow
			},
			{
				image: '/images/dashboard/nastavitve' + imageSuffix + '.png',
				func: feri.ui.createNastavitveWindow
			},
			{
				image: '/images/dashboard/about' + imageSuffix + '.png',
				func: feri.ui.createAboutWindow
			}
		]
	};	
})();