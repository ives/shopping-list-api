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
        const books = await collection.find().toArray();
        debug(books);
        // send back a JSON object
        // res.send(books);
        res.json(books);
      } catch (err) {
        debug(err.stack);
      }

      client.close();
    }());
  }
  function addIngredient(req, res) {
    debug(req.body);

    const { name, supermarket } = req.body;
    if (!name || !supermarket) {
      return displayError(res, 'name and supermarket are both required fields');
    }

    const ingredient = { name, supermarket };
    debug(ingredient);

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
        // findOne - Finds the first one:
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
    addIngredient,
    deleteIngredient,
  };
}

// Note we will execute elsewhere when require
module.exports = shoppingListController;
