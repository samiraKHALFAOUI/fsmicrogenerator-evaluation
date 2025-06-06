const {
  addData,
  getData,
  deleteData,
  updateData,
  getDataById,
  addMany,
} = require("../helpers/dbHelper");
const ligneTransactionModel = require("../models/ligneTransaction.model");
const Transaction = require("../models/transaction.model");

const {
  addManyLigneTransaction,
  updateLigneTransactionById,
} = require("./ligneTransaction.controller");

exports.addTransaction = async (req, res) => {
  try {
    let ligneTransactionData = req.body.transactionLigne;
    req.body.transactionLigne = [];
    const transaction = await addData(req.body, Transaction);


    ligneTransactionData = ligneTransactionData.map((item) => {
      delete item._id;
      item.transaction = transaction._id;
      return item;
    });

    const newLigneT = await addMany(
      ligneTransactionData,
      ligneTransactionModel
    );
    transaction.transactionLigne = newLigneT

    // req.body.transactionLigne = newLigneT.map((item) => item._id);

    res.status(200).json(transaction);
  } catch (error) {
    // // // // // // // // // // // console.log("🚀 ~ exports.addTransaction= ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");

    const transaction = await getData(Transaction, params.condition, "");

    res.status(200).json(transaction);
  } catch (error) {
    console.log("🚀 ~ exports.getTransaction= ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await getDataById(req.params.id, Transaction);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTransactionById = async (req, res) => {
  try {
    dataToPush = [];
    dataToUpdate = [];

    let ligneTransaction = req.body.transactionLigne;
    req.body.transactionLigne = [];

    ligneTransaction = ligneTransaction.map((item) => {
      if (item._id) dataToUpdate.push(item);
      else {
        delete item._id;
        item.transaction = req.params.id;
        dataToPush.push(item);

        return item;
      }
    });
    // // // // // // // // // // // console.log("🚀 ~ ~ dataToPush:", dataToPush);
    // // // // // // // // // // // console.log("🚀 ~ ~ dataToUpdate:", dataToUpdate);

    let newReq = { ...req };

    newReq.body = dataToPush;

    dataToPush = await addMany(dataToPush, ligneTransactionModel);
    // // // // // // // // // // // console.log(
    // // // // // // // // // // // "🚀 ~ exports.updateTransactionById= ~ dataToPush:",
    // // // // // // // // // // // dataToPush
    // // // // // // // // // // // );

    for (let i = 0; i < dataToUpdate.length; i++) {
      const item = dataToUpdate[i];
      newReq.body = item;
      const updatedItem = await updateData(
        item._id,
        newReq.body,
        ligneTransactionModel
      );
      dataToUpdate[i] = updatedItem;
    }
    // // // // // // // // // // // console.log(
    // // // // // // // // // // // "🚀 ~ dataToUpdate=dataToUpdate.map ~ dataToUpdate:",
    // // // // // // // // // // // dataToUpdate
    // // // // // // // // // // // );

    req.body.transactionLigne = [
      ...dataToPush.map((item) => item._id),
      ...dataToUpdate.map((item) => item._id),
    ];

    // // // // // // // // // // // console.log("🚀 ~ exports.updateTransactionById= ~  req.body:", req.body);

    const transaction = await updateData(req.params.id, req.body, Transaction);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    res.json(transaction);
  } catch (error) {
    // // // // // // // // // // // console.log("🚀 ~ exports.updateTransactionById= ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransactionById = async (req, res) => {
  try {
    const transaction = await deleteData(req.params.id, Transaction);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
