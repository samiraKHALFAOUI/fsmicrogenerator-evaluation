// Auto-generated unit tests for supplier
const mongoose = require('mongoose');
const supplier = require('../../models/supplier.model');

describe('supplier Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    logo: "./file/supplier/logo.png",
    translations: [{
      language: "en",
      name: "R1DQZYnR",
      address: "4rlIbAb2"
    }],
    email: "caxnhksM",
    officePhoneNumber: "pbzSuVBn",
    isActif: false,
    purchases: ["40375c686f8acb4c248bbab9"],
    products: ["8935d8c9097dcb18df5e5463"],
  };

  it('should create a valid supplier object', () => {
    const doc = new supplier(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.isActif).toBe('boolean');
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.translations[0].name;
    delete data.translations[0].address;
    delete data.email;
    delete data.officePhoneNumber;

    const doc = new supplier(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors['translations.0.name']).toBeDefined();
    expect(err.errors['translations.0.address']).toBeDefined();
    expect(err.errors).toHaveProperty('email');
    expect(err.errors).toHaveProperty('officePhoneNumber');
  });
});