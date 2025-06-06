// Auto-generated unit tests for inventory
const mongoose = require('mongoose');
const inventory = require('../../models/inventory.model');

describe('inventory Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    product: "2f4514563b0543d1d95543c9",
    type: "code_18416",
    raison: "CJzTyhZW",
    date: new Date("2025-05-12T21:20:23.320Z"),
    quantity: 69,
    price: 303,
    transactionLine: "c3b6bdae2ffaabf41059fb29",
  };

  it('should create a valid inventory object', () => {
    const doc = new inventory(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(typeof doc.product === 'object' || /^[a-f\d]{24}$/i.test(doc.product)).toBe(true);
    expect(doc.date).toBeInstanceOf(Date);
    expect(typeof doc.quantity).toBe('number');
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.product;
    delete data.type;
    delete data.raison;
    delete data.date;
    delete data.price;
    delete data.transactionLine;

    const doc = new inventory(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('product');
expect(err.errors).toHaveProperty('type');
expect(err.errors).toHaveProperty('raison');
expect(err.errors).toHaveProperty('date');
expect(err.errors).toHaveProperty('price');
expect(err.errors).toHaveProperty('transactionLine');
  });

  it('should fail validation if type is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.type = "INVALID_ENUM";
    const doc = new inventory(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['type'].kind).toBe('enum');
  });
});