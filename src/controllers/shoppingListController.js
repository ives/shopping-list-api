const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('server:shoppingListController');

const url = 'mongodb://localhost:27017';
const dbName = 'shoppingListApp';

function shoppingListController() {
  function displayError(res, message) {
    debug(message);
    res.status(400);
    res.json({ message });
    return false;
  }

  function getIngredientList(req, res) {
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo - getIngredientList');

        const db = client.db(dbName);

        const collection = await db.collection('ingredients');
        const item = await collection.find().toArray();
        debug(item);
        // send back a JSON object
        // res.send(item);
        res.status(200).json(item);
      } catch (err) {
        debug(err.stack);
      }

      client.close();
    }());
  }

  function getIngredientById(req, res) {
    (async function mongo() {
      const { id } = req.params;
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo - getIngredientList');

        const db = client.db(dbName);

        const collection = await db.collection('ingredients');
        const item = await collection.findOne({ _id: ObjectID(id) });
        res.status(200).json(item);
      } catch (err) {
        debug(err.stack);
      }

      client.close();
    }());
  }

  function addIngredient(req, res) {
    const { name, supermarket } = req.body;
    if (!name) {
      return displayError(res, 'name is a required field');
    }

    const ingredient = { name, supermarket };

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo - addIngredient');
        const db = client.db(dbName);
        const collection = await db.collection('ingredients');
        const result = await collection.insertOne(ingredient);
        res.json(result.ops[0]);
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function replaceIngredient(req, res) {
    (async function query() {
      const { id } = req.params;

      const { name, supermarket } = req.body;
      if (!name) {
        return displayError(res, 'name is a required field');
      }

      const ingredient = { name, supermarket };
      debug(ingredient);


      let client;

      debug('Connected to Mongo - ID', id);

      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo - replaceIngredient');
        const db = client.db(dbName);
        const collection = await db.collection('ingredients');

        // Returns the OLD item from 'findOne' bit unless set extra params returnOriginal: false
        const updatedItem = await collection
          .findOneAndReplace({ _id: ObjectID(id) }, ingredient, {
            returnOriginal: false,
          });
        res.json(updatedItem.value);
      } catch (err) {
        debug(err.stack);
        displayError(res, `Could not replace: ${err.stack}`);
      }
    }());
  }

  function deleteIngredient(req, res) {
    (async function query() {
      const { id } = req.params;
      let client;

      debug('Connected to Mongo - ID', id);

      try {
        client = await MongoClient.connect(url);
        debug('Connected to Mongo - deleteIngredient');
        const db = client.db(dbName);
        const collection = await db.collection('ingredients');
        const removed = await collection.deleteOne({ _id: ObjectID(id) });
        res.json(removed);
      } catch (err) {
        debug(err.stack);
        displayError(res, `Could not delete: ${err.stack}`);
      }
    }());
  }

  // The Revealing module pattern:
  return {
    getIngredientList,
    getIngredientById,
    addIngredient,
    replaceIngredient,
    deleteIngredient,
  };
}

// Note we will execute elsewhere when require
module.exports = shoppingListController;
