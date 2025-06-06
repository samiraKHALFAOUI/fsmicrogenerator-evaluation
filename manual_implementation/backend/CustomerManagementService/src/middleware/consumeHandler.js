const Customer = require("../models/customer.model");

async function handleMessage(data) {
  console.log("receved request", data);
  const { type, id, body } = data;
  let result = null;
}

async function handleRPCMessage(data) {
  console.log("receved rpc request", data);
  const { type, id } = data;
  let result = null;
  switch (type) {
    case "GET_CUSTOMER_BY_ID":
      result = await Customer.findById(id).lean();
  }
  return result;
}

module.exports = { handleMessage, handleRPCMessage };
