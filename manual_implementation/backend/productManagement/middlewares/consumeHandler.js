const Product = require("../models/Produit.model");

async function handleMessage(data) {
    console.log('receved request', data);
    const { type, id, body } = data
    let result = null
    switch (type) {
        case 'UPDATE_PRODUCT_STOCK': await Product.findByIdAndUpdate(id, body).lean()
    }

}


async function handleRPCMessage(data) {
    console.log('receved rpc request', data);
    const { type, id } = data
    let result = null
    switch (type) {
        case 'GET_PRODUCT_BY_ID': result = await Product.findById(id).lean()
    }
    return result
}

module.exports = { handleMessage, handleRPCMessage };