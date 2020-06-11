const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');

const shoppingListRouter = express.Router();

function router() {
  const {
    getIngredientList, getIngredientById, addIngredient, replaceIngredient, deleteIngredient,
  } = shoppingListController();

  shoppingListRouter
    .route('/ingredients')
    .get(getIngredientList)
    .post(addIngredient);

  shoppingListRouter
    .route('/ingredients/:id')
    .get(getIngredientById)
    .put(replaceIngredient)
    .delete(deleteIngredient);

  return shoppingListRouter;
}

module.exports = router;
