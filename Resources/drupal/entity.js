
// Declaring variables to prevent implied global error in jslint
var Ti, Drupal;

/**
 * Define a new library for Drupal Entity storage.
 */
Drupal.entity = {

    sites: {
        main: {
            /**
             * Entity types known to the system.
             *
             * This is a subset of the information provided in hook_entity_info(). We have
             * to specify it again here because we may not be dealing with Drupal 7 on
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
                        id: 'nid',
                        revision: 'vid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'node/' + id;
                    }
                },
                node_cat: {
                    label: 'Node cat',
                    entity_keys: {
                        id: 'uid',
                        revision: 'vid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'node_cat/' + id;
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
                people: {
                    label: 'People',
                    entity_keys: {
                        id: 'uid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'people/' + id;
                    }
                },
                degrees: {
                    label: 'Degrees',
                    entity_keys: {
                        id: 'uid',
                        bundle: 'type',
                        label: 'title'
                    },
                    schema: {},
                    requestUrl: function (id) {
                        return 'degrees/' + id;
                    }
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
     * @return Drupal.entity.Datastore
     *   A new datastore object for the specified site and entity.
     */
    db: function (site, entityType) {
        var conn = Drupal.db.openConnection(site);
        return new Drupal.entity.Datastore(site, conn, entityType, this.entityInfo(site, entityType));
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
        var service = Drupal.services.createConnection('main');
        service.loadHandler = function () {
            Drupal.entity.db(site, entityType).save(JSON.parse(this.responseText));
        };

        service.request({
            query: this.entityInfo(site, entityType).requestUrl(id)
        });
    }
};


Drupal.entity.DefaultSchema = function () {
    this.fetchUrl = null;
    this.bypassCache = false;
    this.fetchers = {};
};


Drupal.entity.DefaultSchema.prototype.fields = function () {
    return {};
};

Drupal.entity.DefaultSchema.prototype.getFieldValues = function (entity, values) {
    // Do nothing.
};

Drupal.entity.DefaultSchema.prototype.defaultFetcher = function (bundle, store, func, fetchUrl, preDataFunc) {
	
	var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function () {
    	
    	// Call our post-completion callback.
    	var data = {};
    	
    	//
    	// this goes somewhere else, but we don't yet know how to put it there - start
    	//
    	preDataFunc = function (fetchedData) {
    		
    		//alert(eval(fetchedData));
    		
    		var incomingData = JSON.parse(fetchedData);
    		var entities = [];
    		
    		for (var i = 0; i < incomingData.length; i++) {
    			
    			// mapping
    			var entity = {
    				picture: '',
    				name: feri.trim(incomingData[i].Ime),
    				full_name: feri.trim(incomingData[i].Ime + ' ' + incomingData[i].Priimek),
    				title: incomingData[i].HabilitacijskiNazivKratki + ' ' + incomingData[i].Priimek + ' ' + incomingData[i].Ime + ', ' + incomingData[i].SkrajsaniPoklic,
    				company: '',
    				position: incomingData[i].NazivDelovnegaMesta,
    				uid: incomingData[i].Id,
    				bio: '',
    				hours: incomingData[i].GovorilneUre,
    				office: incomingData[i].Kabinet,
    				tel: '02 ' + incomingData[i].Telefon,
    				email: incomingData[i].Email
    			};
            	
            	entities.push({entity: entity});
        	}
        	
    		return entities;
    	};
    	//
    	// this goes somewhere else, but we don't yet know how to put it there - end
    	//
    	
    	var entities = {};
    	
        if (preDataFunc) {
            entities = preDataFunc(this.responseText);
        } else {
        	entities = JSON.parse(data).entities;
        }
    	
        var length = entities.length;
		
        Ti.API.debug('Downloading ' + length + ' entities of type ' + store.entityType);
		
        for (var i = 0; i < length; i++) {
            store.save(entities[i].entity);
        }
        
        // Call our post-completion callback.
        if (func) {
            func();
        }
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