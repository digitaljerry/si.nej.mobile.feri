
// Declaring variables to prevent implied global error in jslint
var Ti, Database;

/**
 * Define a new library for Database Entity storage.
 */
Database.entity = {

    sites: {
        main: {
            /**
             * Entity types known to the system.
             *
             * This is a subset of the information provided in hook_entity_info(). We have
             * to specify it again here because we may not be dealing with Database 7 on
             * the other end.
             *
             * We're using lower_case variables here instead of camelCase so that they
             * exactly match the PHP variables.  That will make dynamic definition easier
             * later.
             */
            types: {
                node: {
                    label: Ti.Locale.getString('Node', 'Node'),
                    entity_keys: {
                        id: 'uid',
                        revision: 'vid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'node/' + id;
                    }
                },
                user: {
                    label: Ti.Locale.getString('User', 'User'),
                    entity_keys: {
                        id: 'uid',
                        bundle: null,
                        label: 'name'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'user/' + id;
                    }
                },
                board_parents: {
                    label: 'Board parents',
                    entity_keys: {
                        id: 'uid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'board_parents/' + id;
                    }
                },
                board_children: {
                    label: 'Board children',
                    entity_keys: {
                        id: 'uid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'board_children/' + id;
                    }
                },
                board_notifications: {
                    label: 'Board notifications',
                    entity_keys: {
                        id: 'uid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'board_notifications/' + id;
                    }
                },
                zadnje_diplome: {
                    label: 'Zadnje diplome',
                    entity_keys: {
                        id: 'uid',
                        label: 'title'
                    },
                    schema: {}
                },
                aktualne_diplome: {
                    label: 'Aktualne diplome',
                    entity_keys: {
                        id: 'uid',
                        label: 'title'
                    },
                    schema: {}
                }
            }
        }
    },

    /**
     * Creates a new entity storage object.
     *
     * @param string site
     *   A key for the site from which we are mirroring 
     *   content. This corresponds to the database we are
     *   loading.
     * @param string entityType
     *   The type of entity (node, user, etc.) that we are
     *   accessing.
     * @return Database.entity.Datastore
     *   A new datastore object for the specified site and entity.
     */
    db: function (site, entityType) {
        var conn = Database.db.openConnection(site);
        return new Database.entity.Datastore(site, conn, entityType, this.entityInfo(site, entityType));
    },

    /**
     * Retrieves information about a defined entity.
     *
     * @param string site
     *   The site key for which we want information.
     * @param entityType
     *   The type of entity for which we want information.
     * @return Object
     *   The entity definition as an object/associative array,
     *   or null if not found.
     */
    entityInfo: function (site, entityType) {
        if (this.sites[site].types[entityType] !== undefined) {
            return this.sites[site].types[entityType];
        }
        Ti.API.error('Entity type ' + entityType + ' not defined for site ' + site);
    },

    /**
     * Mirror an entity from a remote server.
     *
     * Note that the mirroring process is asynchronous. That is, the entity
     * will not be available locally until sometime after this method returns,
     * depending on network latency.
     *
     * @todo Add an event that fires when mirroring is done.
     *
     * @param site
     *   The site key from which to mirror.
     * @param entityType
     *   The type of entity to be mirrored.
     * @param id
     *   The ID of the entity that is being mirrored.
     */
    mirror: function (site, entityType, id) {
        var service = Database.services.createConnection('main');
        service.loadHandler = function () {
            Database.entity.db(site, entityType).save(JSON.parse(this.responseText));
        };

        service.request({
            query: this.entityInfo(site, entityType).requestUrl(id)
        });
    }
};


Database.entity.DefaultSchema = function () {
    this.fetchUrl = null;
    this.bypassCache = false;
    this.fetchers = {};
};


Database.entity.DefaultSchema.prototype.fields = function () {
    return {};
};

Database.entity.DefaultSchema.prototype.getFieldValues = function (entity, values) {
    // Do nothing.
};

Database.entity.DefaultSchema.prototype.defaultFetcher = function (bundle, store, func, fetchUrl, preDataFunc) {
	
	var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function () {
    	
    	// Call our post-completion callback.
    	var data = {};
    	
    	//
    	// this goes somewhere else, but we don't yet know how to put it there - start
    	//
    	preDataFuncUser = function (fetchedData) {
    		
    		fetchedData = fetchedData.replace('var zaposleniFERI=', '');
    		
    		var incomingData = JSON.parse(fetchedData);
    		var entities = [];
    		
    		for (var i = 0; i < incomingData.length; i++) {
    			
    			// checking for right data
    			var phone = '';
    			if ( incomingData[i].Telefon != '' && incomingData[i].Telefon != 'undefined' )
    				var phone = '02 ' + incomingData[i].Telefon;
    			
    			// mapping
    			var entity = {
    				picture: '',
    				name: feri.trim(incomingData[i].Ime),
    				surname: feri.trim(incomingData[i].Priimek),
    				full_name: feri.trim(incomingData[i].Ime + ' ' + incomingData[i].Priimek),
    				title: incomingData[i].HabilitacijskiNazivKratki + ' ' + incomingData[i].Priimek + ' ' + incomingData[i].Ime + ', ' + incomingData[i].SkrajsaniPoklic,
    				company: '',
    				position: incomingData[i].NazivDelovnegaMesta,
    				uid: incomingData[i].Id,
    				bio: '',
    				hours: incomingData[i].GovorilneUre,
    				office: incomingData[i].Kabinet,
    				tel: phone,
    				email: incomingData[i].Email
    			};
            	
            	entities.push({entity: entity});
        	}
        	
    		return entities;
    	};
    	
    	preDataFuncNode = function (fetchedData) {
    		
    		var entities = [];
    		
    		Ti.API.info('>>> got the feed! ... ');
    			
			var doc = fetchedData.documentElement;
			var items = doc.getElementsByTagName("item");
			
			var x = 0;
			var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
			for (var c=0;c<items.length;c++) {
				
				var item = items.item(c);
				
				// parse guid
				var chopchop = item.getElementsByTagName("guid").item(0).text;
				chopchop = chopchop.replace('http://www.feri.uni-mb.si/odeska/brnj2.asp?id', '');
				chopchop = chopchop.split('=');
				
				var guid = chopchop[1].replace('&amp;', '').replace('oce', '');
				var oce = chopchop[2];
				
				chopchop = item.getElementsByTagName("author").item(0).text;
				chopchop = chopchop.split('(');
				var author = chopchop[0];
				
				// mapping
    			var entity = {
    				uid: guid,
    				title: item.getElementsByTagName("title").item(0).text,
    				body: item.getElementsByTagName("description").item(0).text,
    				author: author,
    				date: item.getElementsByTagName("pubDate").item(0).text,
    				category: oce
    			};
    			entities.push({entity: entity});
    			
    		}
    		
    		return entities;
    	};
    	
    	preDataFuncAktualneDiplome = function (fetchedData) {
    		
    		var entities = [];
    		
    		Ti.API.info('>>> got the feed! ... ');
    		
    		var doc = fetchedData.documentElement;
			var items = doc.getElementsByTagName("li");
			
			for (var c=0;c<items.length;c++) {
				
				var item = items.item(c);
				
				// parse guid
				/*var chopchop = item.getElementsByTagName("link").item(0).text;
				chopchop = chopchop.split('id=');
				var dkum_uid = chopchop[1]; 
				
				var chopchop = item.getElementsByTagName("description").item(0).text;
				chopchop = chopchop.split('<br />');
				var author = chopchop[0].replace(':', '');
				var description = chopchop[4];*/
				var candidate = feri.trim(item.getElementsByTagName("div").item(2).text.replace('Kandidat:', ''));
				var title = feri.trim(item.getElementsByTagName("div").item(1).text);
				var details = item.getElementsByTagName("div").item(0).text;
				
				// mapping
    			var entity = {
    				uid: (title.length + candidate.length + details.length),
    				title: title,
    				details: details,
    				candidate: candidate
    			};
    			entities.push({entity: entity});
    		}
    		
    		return entities;
    	};
    	
    	preDataFuncZadnjeDiplome = function (fetchedData) {
    		
    		var entities = [];
    		
    		Ti.API.info('>>> got the feed! ... ');
    			
			var doc = fetchedData.documentElement;
			var items = doc.getElementsByTagName("item");
			
			var x = 0;
			var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
			for (var c=0;c<items.length;c++) {
				
				var item = items.item(c);
				
				// parse guid
				var chopchop = item.getElementsByTagName("link").item(0).text;
				chopchop = chopchop.split('id=');
				var dkum_uid = chopchop[1]; 
				
				var chopchop = item.getElementsByTagName("description").item(0).text;
				chopchop = chopchop.split('<br />');
				var author = chopchop[0].replace(':', '');
				var description = chopchop[4];
				
				// mapping
    			var entity = {
    				uid: dkum_uid,
    				title: item.getElementsByTagName("title").item(0).text,
    				description: description,
    				author: author,
    				date: item.getElementsByTagName("pubDate").item(0).text,
    				link: item.getElementsByTagName("link").item(0).text
    			};
    			entities.push({entity: entity});
    			
    		}
    		
    		return entities;
    	};
    	
    	//
    	// this goes somewhere else, but we don't yet know how to put it there - end
    	//
    	
    	var entities = {};
    	
        if (bundle == 'user') {
            entities = preDataFuncUser(this.responseText);
        } else if (bundle == 'node') {
        	entities = preDataFuncNode(this.responseXML);
        } else if (bundle == 'aktualne_diplome') {
        	entities = preDataFuncAktualneDiplome(this.responseXML);
        } else if (bundle == 'zadnje_diplome') {
        	entities = preDataFuncZadnjeDiplome(this.responseXML);
        } else {
        	entities = JSON.parse(data).entities;
        }
        
        var length = entities.length;
		
        Ti.API.debug('Downloading ' + length + ' entities of type ' + store.entityType);
        
        // ok we apperantly got new data, so we can do a TRUNCATE
        Database.entity.db('main', bundle).truncateTable(bundle);
		
        for (var i = 0; i < length; i++) {
            store.save(entities[i].entity);
        }
        
        // Call our post-completion callback.
        if (func) {
            func();
        }
        
        feri.ui.activityIndicator.hideModal();
    };

    //open the client and encode our URL
    var url = fetchUrl || this.fetchUrl || null;
    if (url) {
        if (this.bypassCache) {
            if (strpos(url, '?') === false) {
                url += '?cacheBypass=' + Math.random();
            } else {
                url += '&cacheBypass=' + Math.random();
            }
        }
        xhr.open('GET', url);

        //send the data
        Ti.API.debug('Requesting data from: ' + url);
        xhr.send();
    } else {
        Ti.API.error('No fetching URL found. Unable to retrieve data.');
    }
};