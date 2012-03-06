
// Define our entity storage rules.
Database.entity.sites.main.types.node.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                body: {
                    type: 'TEXT'
                },
                author: {
                    type: 'VARCHAR'
                },
                date: {
                    type: 'VARCHAR'
                },
                category: {
                    type: 'INTEGER'
                }
            },
            indexes: {
            	uid_idx: ['uid']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
        
        if (typeof entity.instructors !== undefined) {
            var instructors = [];
            if (typeof entity.instructors === 'string') {
                instructors.push(entity.instructors);
            } else if (typeof entity.instructors == 'object') {
                for (var insKey in entity.instructors) {
                    instructors.push(entity.instructors[insKey]);
                }
            }
            entity.instructors = instructors;
            values.instructors = instructors.join(', ');
        }
    },

    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Database.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
    	
    	// get all uid's from the database
    	
    	
        //var url = 'http://feri.tux.si/mobile/board/latest' + bundle;
        //var url = 'http://www.feri.uni-mb.si/odeska/getxml.aspx?pIDs=13,51,42,15,25,45,77,81&max=25&stDni=60';
        var url = 'http://www.feri.uni-mb.si/odeska/getxml.aspx?pIDs=7,4,5,112,144,150,151,152,153,154,155,156,157,143,145,159,160,83,84,85,86,87,88,89,90,91,92,93,94,95,97,96,98,99,101,102,100,158,77,105,130,118,162,135,128,62,78,79,80,131,137,146,129,111,113,114,119,125,147,148,161,82,121,108,124,107,123,81,120,104,122,8,9,115,116,117,29,30,31,32,126,53,54,20,22,23,55,56,57,58,10,12,33,26,27,34,43,44,35,11,18,67,36,110,134,16,17,138,139,140,142,13,51,41,46,106,19,136,47,63,64,68,70,71,69,72,73,74,75,76,48,14,24,59,45,65,66,60,37,15,25,42,61&max=25&stDni=60';
        //var url = 'http://rss.cnn.com/services/podcasting/newscast/rss.xml';
        
        //var url = 'http://codestrong.com/mobile/sessions/' + bundle;
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Database.entity.sites.main.types.node.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

Database.entity.sites.main.types.user.schema = {
    fields: function () {
        return {
            fields: {
            	uid: {
                    type: 'INTEGER'
                },
                full_name: {
                    type: 'VARCHAR'
                },
                name: {
                    type: 'VARCHAR'
                },
                surname: {
                    type: 'VARCHAR'
                },
                full_name: {
                    type: 'VARCHAR'
                },
                hours: {
                    type: 'VARCHAR'
                },
                office: {
                    type: 'VARCHAR'
                },
                tel: {
                    type: 'VARCHAR'
                },
                email: {
                    type: 'VARCHAR'
                },
                position: {
                    type: 'VARCHAR'
                },
                title: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                full_name_idx: ['full_name'],
                name_idx: ['name']
            }
        };
    },
    
    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Database.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param {function} func
     *   A callback functino that will be called when the fetch is complete.
     */
    // read more @ http://osebje.feri.uni-mb.si/
    defaultFetcher: function (bundle, store, func) {
    	
    	// obsolete:
    	//this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://feri.tux.si/mobile/zaposleni/']);
    	//this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://codestrong.com/mobile/speakers']);
    	
    	//this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://feri.tux.si/mobile/zaposleni2/']);
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://osebje.feri.uni-mb.si/cache/data/sm=7038.txt']);
    }

};
Database.entity.sites.main.types.user.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

// Define our entity storage rules.
Database.entity.sites.main.types.board_parents.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                parent: {
                    type: 'INTEGER'
                }
            },
            indexes: {
                uid_idx: ['uid'],
                parent_idx: ['parent']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    }
};
Database.entity.sites.main.types.board_parents.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

// Define our entity storage rules.
Database.entity.sites.main.types.board_children.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                parent: {
                    type: 'INTEGER'
                },
                favourite: {
                    type: 'INTEGER'
                },
                push: {
                    type: 'INTEGER'
                }
            },
            indexes: {
                uid_idx: ['uid'],
                parent_idx: ['parent']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    }
};
Database.entity.sites.main.types.board_children.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

// Define our entity storage rules.
Database.entity.sites.main.types.board_notifications.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                category: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                description: {
                    type: 'TEXT'
                },
                pubDate: {
                    type: 'VARCHAR'
                },
                author: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                uid_idx: ['uid'],
                category_idx: ['category']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    }
};
Database.entity.sites.main.types.board_notifications.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

// Define our entity storage rules.
Database.entity.sites.main.types.aktualne_diplome.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                details: {
                    type: 'VARCHAR'
                },
                candidate: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                uid_idx: ['uid']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    },
    
    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Database.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
    	
    	var url = 'http://www.feri.uni-mb.si/zadnjizagovori.html';
    	
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Database.entity.sites.main.types.aktualne_diplome.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);

Database.entity.sites.main.types.zadnje_diplome.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                date: {
                    type: 'VARCHAR'
                },
                author: {
                    type: 'VARCHAR'
                },
                description: {
                    type: 'TEXT'
                },
                link: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                uid_idx: ['uid']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    },
    
    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Database.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
    	
    	var url = 'http://dkum.uni-mb.si/rss.php?o=3&v=dip';
        
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Database.entity.sites.main.types.zadnje_diplome.schema.prototype = Database.constructPrototype(Database.entity.DefaultSchema);
