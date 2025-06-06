

async function addData(data, Model) {
  const doc = new Model(data);
  return await doc.save();
}

async function addMany(dataArray, Model) {
  return await Model.insertMany(dataArray);
}

async function getData(Model, filter = {}, populate = '') {
  return await Model.find(filter).populate(populate).lean();
}

async function getDataById(id, Model, populate = '') {
  return await Model.findById(id).populate(populate).lean();
}

async function updateData(id, newData, Model) {
  return await Model.findByIdAndUpdate(id, newData, { new: true }).lean();
}

async function deleteData(id, Model) {
  return await Model.findByIdAndDelete(id).lean();
}

module.exports = {
  addData,
  addMany,
  getData,
  getDataById,
  updateData,
  deleteData
};
