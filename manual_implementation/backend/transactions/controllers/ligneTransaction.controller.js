const { addMany, deleteData } = require("../helpers/dbHelper");
const ligneTransactionModel = require("../models/ligneTransaction.model");

exports.addManyLigneTransaction = async (req, res) => {
  try {
    const ligneTransactions = await addMany(req.body, ligneTransactionModel);
    res.status(200).json(ligneTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLigneTransactionById = async (req, res) => {
  try {
    const transaction = await deleteData(req.params.id, ligneTransactionModel);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
