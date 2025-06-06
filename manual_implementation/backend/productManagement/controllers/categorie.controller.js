const categorieModel = require("../models/categorie.model");

/**
 * Add a new category
 */
exports.ajouterCategorie = async (req, res) => {
    try {
        let categorie = new categorieModel(req.body)
        categorie = categorie.save()
        return res.status(200).send(categorie);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
};



/**
 * Get all categories
 */
exports.getCategories = async (req, res) => {
    try {
        let categories = await categorieModel.find().lean()
        return res.status(200).send(categories);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
};

/**
 * Get category by ID
 */
exports.getCategoryById = async (req, res) => {
    try {
        let category = await categorieModel.findById(req.params.id).lean();
        return res.status(200).send(category);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
};

/**
 * Update category
 */
exports.updateCategory = async (req, res) => {
    try {
        let category = await categorieModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        return res.status(200).send(category);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
};

/**
 * Delete category
 */
exports.deleteCategory = async (req, res) => {
    try {
        let category = await categorieModel.findByIdAndDelete(req.params.id).lean();
        return res.status(200).send(category);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
}; 