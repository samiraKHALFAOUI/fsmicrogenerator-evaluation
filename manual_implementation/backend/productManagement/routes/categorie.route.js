const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categorie.controller");

router.get('/', categorieController.getCategories)
router.post('/', categorieController.ajouterCategorie);

router.get("/:id", categorieController.getCategoryById)
router.patch("/:id", categorieController.updateCategory)
router.delete("/:id", categorieController.deleteCategory);

module.exports = router; 