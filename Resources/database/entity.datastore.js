// Declaring variables to prevent implied global error in jslint
var Database, Ti;

/**
 * Creates a Database Datastore object.
 *
 * A datastore object serves as a repository for loading
 * and saving cached entities.  Although it uses SQLite
 * under the hood, it's not truly accessible as an SQL engine.
 *
 * @param string site
 *   The site key to wich this datastore is bound.
 * @param Ti.Database.DB connection
 *   The database connection object for this datastore.
 * @param string
 *   The type of entity this datastore should access.
 * @return Database.entity.Datastore
 */
Database.entity.Datastore = function(site, connection, entityType, entityInfo) {
  this.site = site;
  this.connection = connection;
  this.entityType = entityType;
  this.entityInfo = entityInfo;
  this.idField = this.getIdField();

  this.schemaDefinition = null;

  return this;
};

/**
 * Returns the name of the field that holds the primary key for entities of this type.
 *
 * @return string
 *   The name of the field that holds this entity type's primary key.
 */
Database.entity.Datastore.prototype.getIdField = function() {
  var idField = this.entityInfo.entity_keys.id;

  return idField;
};

/**
 * Saves an entity into the local database.
 *
 * Note that although we allow saving of new entities,
 * a primary key is required. One will not be created
 * automatically and the query will fail if one is not
 * defined.
 *
 * @param Object entity
 *   A Database entity to save.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an
 *   entity object retrieved from a Database site.
 */
Database.entity.Datastore.prototype.save = function(entity, forceRemove) {

  if (forceRemove == 'undefined' || forceRemove == 0)
    forceRemove = false;

  // For simplicity, we'll just do a delete/insert cycle.
  // We're only using a very simple (if dynamic) schema,
  // so this lets us avoid having to write a dynamic
  // update builder for now.

  // new stuff
  // we already did a TRUNCATE so deleting isn't needed anymore
  // unless we force it !
  if (forceRemove)
    this.remove(entity[this.idField]);

  return this.insert(entity);
};

/**
 * Inserts a new entity into the local database.
 *
 * @param Object entity
 *   A Database entity to insert.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an
 *   entity object retrieved from a Database site.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for
 *   a successful insert or 0 if something went wrong.
 */
Database.entity.Datastore.prototype.insert = function(entity) {
  if (this.entityInfo.label === 'Node') {
    var timeslot = entity['time'];
    var m = /^(\d+)\s+([^\s]+)\s+(\d\d\:\d\d)\s*\-\s*(\d\d\:\d\d)/.exec(timeslot);
  }

  // handle Android `delete` issue
  var fields = {};
  if (feri.isAndroid()) {
    for (var mykey in entity) {
      if (mykey !== 'time') {
        fields[mykey] = entity[mykey];
      }
    }
  } else {
    delete entity['time'];
    fields = entity;
  }

  // And finally, store the serialized entity object.
  fields.data = JSON.stringify(entity);

  // Ensure that the schema table exists.
  if (!this.connection.tableExists(this.entityType)) {
    this.connection.createTable(this.entityType, this.getSchema());
  }

  this.connection.insert(this.entityType).fields(fields).execute();

  return this.connection.rowsAffected;
};

/**
 * Updates an existing entity in the local database.
 *
 * Note: if the specified object does not already exist,
 * it will not be saved.  To ensure that an object
 * is saved properly call the save() method instead.
 *
 * @param Object entity
 *   A Database entity to update.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an
 *   entity object retrieved from a Database site.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for
 *   a successful update or 0 if the entity didn't exist in the
 *   first place.
 */
Database.entity.Datastore.prototype.update = function(entity) {
  var data = JSON.stringify(entity);
  this.connection.query("UPDATE " + this.entityType + " SET type=?, title=?, data=? WHERE uid=?", [entity.type, entity.title, data, entity[this.idField]]);
  return this.connection.rowsAffected;
};

/**
 * Determines if an entity with the given ID already exists.
 *
 * The ID is localized to the keyspace of this datastore's
 * site and entity type.
 *
 * @param integer id
 *   The ID of the entity to check.
 * @return boolean
 *   true if an entity with the specified ID exists, false
 *   if not or if there was an error.
 */
Database.entity.Datastore.prototype.exists = function(id) {
  var rows = this.connection.query("SELECT 1 FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);
  var ret = rows && rows.rowCount;
  if (rows) {
    rows.close();
  }
  return ret;
};

/**
 * Loads a single entity from the datastore.
 *
 * @param integer id
 *   The ID of the entity to load.
 * @return Object
 *   The entity with the specified ID if any, or null
 *   if one was not found.
 */
Database.entity.Datastore.prototype.load = function(id) {
  var entities = this.loadMultiple([id]);

  if (entities && entities[0]) {
    return entities[0];
  } else {
    Ti.API.error('No such entity found: ' + id);
    return null;
  }
};

/**
 * Loads multiple entities from the datastore.
 *
 * @todo Figure out some way to control the order
 *   in which the entities are returned.
 * @param {Array} ids
 *   An array of entity IDs to load.
 * @param {Array} order
 *   The fields by which to order the query.  Each array element is a field by
 *   which to order.  If Descending order, it should include DESC in the string.
 * @return {Array}
 *   An array of loaded entity objects.  If none were found
 *   the array will be empty. Note that the order of entities
 *   in the array is undefined.
 */
Database.entity.Datastore.prototype.loadMultiple = function(ids, order, direction) {
  var dir = true;
  if (direction == false)
    dir = false;
  return this.loadByField(this.idField, ids, order, dir);
};

/**
 * Load multiple entities from the datastore by a non-primary-key field.
 *
 * This function will return all records for which the "field" field is equal to
 * one of the values in "values".
 *
 * @param {string} field
 *   The field by which we want to load.  This must be a denormalized field,
 *   either one of the standard fields or one specific to the entity being
 *   requested.
 * @param {Array} values
 *   An array of values for records we want to retrieve.
 * @param {Array} order
 *   The fields by which to order the query.  Each array element is a field by
 *   which to order.  If Descending order, it should include DESC in the string.
 *   If no order is specified then the order of results is undefined.
 * @return {Array}
 *   An array of loaded entity objects.  If none were found the array will be
 *   empty.
 */
Database.entity.Datastore.prototype.loadByField = function(field, values, order, direction) {
  var entities = [];
  var placeholders = [];

  for (var i = 0, numPlaceholders = values.length; i < numPlaceholders; i++) {
    placeholders.push('?');
  }

  var query = 'SELECT data FROM ' + this.entityType + ' WHERE ' + field + ' IN (' + placeholders.join(', ') + ')';
  if (order !== undefined) {
    query += ' ORDER BY ' + order.join(', ') + ((direction == true) ? '' : ' DESC');
  }
  var rows = this.connection.query(query, values);

  if (rows) {
    while (rows.isValidRow()) {
      var data = rows.fieldByName('data');
      var entity = JSON.parse(data);
      entities.push(entity);
      rows.next();
    }
    rows.close();
  }

  return entities;
};

/**
 * Remove an entity from the datastore.
 *
 * This would be called delete(), but that's a reserved word
 * in Javascript.
 *
 * Note that removing an entity from the local datastore does
 * not remove it from the site being mirrored. It only removes
 * the local copy.
 *
 * @param integer id
 *   The ID of the entity to remove.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for
 *   a successful deletion or 0 if the entity didn't exist in the
 *   first place.
 */
Database.entity.Datastore.prototype.remove = function(id) {
  this.connection.query("DELETE FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);
  return this.connection.rowsAffected;
};

Database.entity.Datastore.prototype.doQuery = function(query) {

  Ti.API.debug(query);
  var rows = this.connection.query(query);
  if (rows) {
    while (rows.isValidRow()) {
      var data = rows.fieldByName('data');
      var entity = JSON.parse(data);
      entities.push(entity);
      rows.next();
    }
    rows.close();
  }

  return entities;
};

Database.entity.Datastore.prototype.fetchUpdates = function(bundle) {
  var callback = function() {
    // Let other systems respond to the update completion.
    Ti.App.fireEvent('database:entity:datastore:update_completed', {
      entity : this.entityType,
      bundle : bundle
    });
  };

  if (this.entityInfo.schema.fetchers && this.entityInfo.schema.fetchers[bundle]) {
    this.entityInfo.schema.fetchers[bundle](this, callback);
  } else if (this.entityInfo.schema.defaultFetcher) {
    this.entityInfo.schema.defaultFetcher(bundle, this, callback);
  } else {
    Ti.API.error('No fetcher found for entity: ' + this.entityType + ', bundle: ' + bundle);
    throw new Error('No fetcher found for entity: ' + this.entityType + ', bundle: ' + bundle);
  }
};

Database.entity.Datastore.prototype.defaultUpdater = function(bundle) {

};

/**
 * Reinitializes the schema for this datastore.
 *
 * Note: This means dropping and recreating the table for this entity
 * type.  That is, all existing data will be destroyed.  Did we mention
 * *all existing data for this entity type will be lost*?
 */
Database.entity.Datastore.prototype.initializeSchema = function() {
  this.connection.dropTable(this.entityType);
  this.connection.createTable(this.entityType, this.getSchema());
};

/**
 * Returns the schema definition for this enity's storage.
 */
Database.entity.Datastore.prototype.getSchema = function() {
  if (!this.schemaDefinition) {
    var schema = {
      description : 'Storage table for ' + this.entityType + ' entities.',
      fields : {},
      indexes : {},
      uniqueKeys : {}
    };

    // We always want to denormalize the entity keys, if available.
    if (this.entityInfo.entity_keys.id) {
      schema.fields[this.entityInfo.entity_keys.id] = {
        type : 'INTEGER'
      };
      schema.primaryKey = [this.entityInfo.entity_keys.id];
    }
    if (this.entityInfo.entity_keys.revision) {
      schema.fields[this.entityInfo.entity_keys.revision] = {
        type : 'INTEGER'
      };
    }
    if (this.entityInfo.entity_keys.bundle) {
      schema.fields[this.entityInfo.entity_keys.bundle] = {
        type : 'VARCHAR'
      };
    }
    if (this.entityInfo.entity_keys.label) {
      schema.fields[this.entityInfo.entity_keys.label] = {
        type : 'VARCHAR'
      };
    }

    // Now extract any additional fields and indexes to denormalize.
    if (this.entityInfo.schema.fields) {
      var extraSchema = this.entityInfo.schema.fields();
      var properties = ['fields', 'indexes', 'uniqueKeys'];
      var set;
      var property;
      for (var i = 0; i < properties.length; i++) {
        property = properties[i];
        set = extraSchema[property];
        for (var key in set) {
          if (set.hasOwnProperty(key)) {
            schema[property][key] = set[key];
          }
        }
      }
    }

    // We always want a "data" column to store the serialized object itself.
    schema.fields.data = {
      type : 'BLOB'
    };

    this.schemaDefinition = schema;
  }

  return this.schemaDefinition;
};

Database.entity.Datastore.prototype.fixTables = function(table) {

  var query = 'SELECT * FROM ' + table;
  Ti.API.debug('Fixing: ' + query);

  var resultSet = this.connection.query(query);
  var fieldCount = resultSet.fieldCount();
  var fields = [];
  for (var i = 0; i < fieldCount; i++) {
    fields.push(resultSet.fieldName(i));
  };

  while (resultSet.isValidRow()) {
    var result = {};
    var uid = resultSet.fieldByName('uid');

    for (var i = 0; i < fields.length; i++) {
      if (fields[i] != 'data') {
        result[fields[i]] = resultSet.fieldByName(fields[i]);
      }
    }
    var json_result = JSON.stringify(result).replace(/\'/g, "\\'");
    ;

    var query2 = 'UPDATE ' + table + ' SET data = \'' + json_result + '\' WHERE uid = ' + uid;
    this.connection.query(query2);

    resultSet.next();
  };
  resultSet.close();
};

Database.entity.Datastore.prototype.truncateTable = function(table) {
  var query = 'DELETE FROM ' + table;
  return this.connection.query(query);
}; 