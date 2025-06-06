// Auto-generated unit tests for product
const mongoose = require('mongoose');
const product = require('../../models/product.model');

describe('product Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    reference: "UWQrmFmH",
    category: "2f1d8f31e9aa191932b89200",
    image: "./file/product/image.png",
    translations: [{
      language: "en",
      name: "sl9rKbGB",
      description: "Q8ZByn4U"
    }],
    salePrice: 68,
    currency: "f1aa3f3c57290078421c76cb",
    stockQuantity: 276,
    unit: "1af7d4315d84675656cc2e73",
    status: "code_18398",
    supplier: "742ceb0f5d1054e44924da1f",
    transactionLines: ["255cc3889577128cb53ac6a1"],
    inventoryMovements: ["8409c7a12a36fe52e092e28a"],
  };

  it('should create a valid product object', () => {
    const doc = new product(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(typeof doc.category === 'object' || /^[a-f\d]{24}$/i.test(doc.category)).toBe(true);
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.salePrice).toBe('number');
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.reference;
    delete data.translations[0].name;
    delete data.status;
    delete data.supplier;

    const doc = new product(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('reference');
    expect(err.errors['translations.0.name']).toBeDefined();
    expect(err.errors).toHaveProperty('status');
    expect(err.errors).toHaveProperty('supplier');
  });

  it('should fail validation if status is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.status = "INVALID_ENUM";
    const doc = new product(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['status'].kind).toBe('enum');
  });
});