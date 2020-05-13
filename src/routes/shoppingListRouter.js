const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');

const shoppingListRouter = express.Router();

function router() {
  const { getIngredientList, addIngredient, deleteIngredient } = shoppingListController();

  shoppingListRouter
    .route('/ingredients')
    .get(getIngredientList)
    .post(addIngredient);

  shoppingListRouter
    .route('/ingredients/:id')
    .delete(deleteIngredient);

  return shoppingListRouter;
}

module.exports = router;
