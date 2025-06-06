// Auto-generated unit tests for customer
const mongoose = require('mongoose');
const customer = require('../../models/customer.model');

describe('customer Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    photo: "QSAvQz8T",
    translations: [{
        language: "en",
        name: "8sxIVP1d",
        address: "5FJzoioc"
      }],
    email: "zpTVZzMn",
    phoneNumber: "w4UnVjur",
    orders: ["0f61787753cfeab0fde37293"],
  };

  it('should create a valid customer object', () => {
    const doc = new customer(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.translations[0].name;
    delete data.email;
    delete data.phoneNumber;

    const doc = new customer(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors['translations.0.name']).toBeDefined();
expect(err.errors).toHaveProperty('email');
expect(err.errors).toHaveProperty('phoneNumber');
  });
});