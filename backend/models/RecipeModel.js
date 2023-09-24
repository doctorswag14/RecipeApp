//import connection
import db from "../config/database.js";

//get all products
export const getRecipes = (result) => {
  db.query("SELECT * FROM SavedRecipes", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

//get single product
export const getRecipeById = (id, result) => {
  db.query(
    "SELECT * FROM SavedRecipes WHERE RecipeId = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

//insert product to databased
export const insertRecipe = (data, result) => {
  db.query("INSERT INTO SavedRecipes SET ?", [data], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// Update Product to Database
export const updateRecipeById = (data, id, result) => {
  db.query(
    "UPDATE SavedRecipes SET Title = ?, Ingredients = ?, Directions = ?  WHERE RecipeId = ?",
    [data.Title, data.Ingredients, data.Directions, id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

// Delete Product to Database
export const deleteRecipeById = (id, result) => {
  db.query("DELETE FROM SavedRecipes WHERE RecipeId = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};