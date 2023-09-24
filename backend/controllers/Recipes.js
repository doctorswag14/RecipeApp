import {
    getRecipes,
    getRecipeById,
    insertRecipe,
    updateRecipeById,
    deleteRecipeById,
  } from "../models/RecipeModel.js";

  //get all products
export const showRecipes = (req, res) => {
    getRecipes((err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };
  
  //get single product
  export const showRecipesById = (req, res) => {
    getRecipeById(req.params.id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };
  
  //create new product
  export const createRecipe = (req, res) => {
    const data = req.body;
    insertRecipe(data, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };
  
  // Update Product
  export const updateRecipe = (req, res) => {
    const data = req.body;
    const id = req.params.id;
    updateRecipeById(data, id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };
  
  // Delete Product
  export const deleteRecipe = (req, res) => {
    const id = req.params.id;
    deleteRecipeById(id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };