//import express
import express from "express";

//import functions from controller
import { createRecipe, deleteRecipe, showRecipes, showRecipesById, updateRecipe } from "../controllers/Recipes.js";

//init express router
const router = express.Router();

//get all product
router.get("/recipes", showRecipes);

//get single product
router.get("/recipes/:id", showRecipesById);

// Create New Product
router.post("/recipes", createRecipe);

// Update Product
router.put("/products/:id", updateRecipe);

// Delete Product
router.delete("/products/:id", deleteRecipe);

//export default router
export default router;