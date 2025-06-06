// Auto-generated unit tests for transactionLine
const mongoose = require('mongoose');
const transactionLine = require('../../models/transactionLine.model');

describe('transactionLine Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    product: "2d7fb8b2ec53b7a26678515e",
    quantity: 243,
    price: 909,
    currency: "3554360b1930baf4b0699bbd",
    transaction: "f74609312bf2516b396be37e",
    inventoryMovement: ["7bf5ae77060318955e02efcd"],
  };

  it('should create a valid transactionLine object', () => {
    const doc = new transactionLine(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(typeof doc.product === 'object' || /^[a-f\d]{24}$/i.test(doc.product)).toBe(true);
    expect(typeof doc.quantity).toBe('number');
    expect(doc.inventoryMovement).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.product;
    delete data.quantity;
    delete data.price;
    delete data.currency;
    delete data.transaction;

    const doc = new transactionLine(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('product');
expect(err.errors).toHaveProperty('quantity');
expect(err.errors).toHaveProperty('price');
expect(err.errors).toHaveProperty('currency');
expect(err.errors).toHaveProperty('transaction');
  });
});