
// Define our entity storage rules.
Drupal.entity.sites.main.types.node.schema = {
    fields: function () {
        return {
            fields: {
                changed: {
                    type: 'INTEGER'
                },
                author: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                'node_changed': ['changed'],
                'room_idx': ['room']
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
     * @param {Drupal.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
        var url = 'http://feri.tux.si/mobile/board/latest' + bundle;
        //var url = 'http://codestrong.com/mobile/sessions/' + bundle;
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Drupal.entity.sites.main.types.node.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

Drupal.entity.sites.main.types.user.schema = {
    fields: function () {
        return {
            fields: {
                full_name: {
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
     * @param {Drupal.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param {function} func
     *   A callback functino that will be called when the fetch is complete.
     */
    defaultFetcher: function (bundle, store, func) {
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://feri.tux.si/mobile/zaposleni/']);
        //this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://codestrong.com/mobile/speakers']);
    }

};
Drupal.entity.sites.main.types.user.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.node_cat.schema = {
    fields: function () {
        return {
            fields: {
                title: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                title_idx: ['title']
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
     * @param {Drupal.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
        var url = 'http://feri.tux.si/mobile/board/tree/';
        //var url = 'http://codestrong.com/mobile/sessions/' + bundle;
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Drupal.entity.sites.main.types.node_cat.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.board_parents.schema = {
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
Drupal.entity.sites.main.types.board_parents.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.board_children.schema = {
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
Drupal.entity.sites.main.types.board_children.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.board_notifications.schema = {
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
                link: {
                    type: 'VARCHAR'
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
Drupal.entity.sites.main.types.board_notifications.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.people.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                title: {
                    type: 'VARCHAR'
                },
                position: {
                    type: 'VARCHAR'
                },
                first_name: {
                    type: 'VARCHAR'
                },
                last_name: {
                    type: 'VARCHAR'
                },
                email: {
                    type: 'VARCHAR'
                },
                office: {
                    type: 'VARCHAR'
                },
                hours: {
                    type: 'VARCHAR'
                },
                phone: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                uid_idx: ['uid'],
                last_name_idx: ['last_name']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;
    }
};
Drupal.entity.sites.main.types.people.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

// Define our entity storage rules.
Drupal.entity.sites.main.types.degrees.schema = {
    fields: function () {
        return {
            fields: {
                uid: {
                    type: 'INTEGER'
                },
                link: {
                    type: 'VARCHAR'
                },
                description: {
                    type: 'TEXT'
                },
                pubDate: {
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
    }
};
Drupal.entity.sites.main.types.degrees.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

