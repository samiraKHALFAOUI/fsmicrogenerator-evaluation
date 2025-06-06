const {
  addData,
  addMany,
  getData,
  getById,
  updateData,
  deleteData,
} = require("../helpers/helpers");
const ProduitModel = require("../models/Produit.model");
const upload = require("../utils/fileUpload");
populate = "category";


exports.add = async (req, res) => {
  try {
    console.log("produit===>", req.file);
    Object.keys(req.body).map((key) => {
      const value = req.body[key];
      console.log("produit===>", key, '===>', value, '===>', typeof value);
    
      if (
        typeof value === 'string' &&
        (value.trim().startsWith('{') || value.trim().startsWith('['))
      ) {
        try {
          req.body[key] = JSON.parse(value);
        } catch (e) {
          console.warn(`Failed to parse key "${key}":`, e.message);
        }
      }
    });
    console.log("🚀 ~ exports.add= ~ req:", req.body);
   let data = await addData(req.body, ProduitModel);
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};





exports.getProducts = async (req, res) => {
  try {
    let params = JSON.parse(req.query.condition || "{}");
    let data = await getData(ProduitModel, params, populate);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};


exports.getById = async (req, res) => {
  try {
    let params = req.params;
    let data = await getById(params.id, ProduitModel, populate);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    Object.keys(req.body).map((key) => {
      req.body[key] = JSON.parse(req.body[key]);
    });
    if (req.file) {
      req.body["image"] = req.file.path;
    }

    let data = await updateData(req.params.id, req.body, ProduitModel);
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};


exports.delete = async (req, res) => {
  try {
    let data = await deleteData(req.params.id, ProduitModel);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 * Upload product image
 */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Update the product with the image path
    const imagePath = req.file.path;
    const updatedProduct = await updateData(
      req.params.id,
      { image: imagePath },
      ProduitModel
    );

    return res.status(200).send({
      message: "Image uploaded successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

