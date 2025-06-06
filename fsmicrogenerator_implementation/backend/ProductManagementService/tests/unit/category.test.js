// Auto-generated unit tests for category
const mongoose = require('mongoose');
const category = require('../../models/category.model');

describe('category Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    icon: "./file/category/icon.png",
    translations: [{
      language: "en",
      name: "NCzPbhy2"
    }],
    products: ["2a2aa6e24b7d0d71f75b59d0"],
    parentCategory: "61b2afd01710cbfa31393b02",
    subCategories: ["b6c80dd72a8dba38cbae95e0"],
  };

  it('should create a valid category object', () => {
    const doc = new category(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.parentCategory === 'object' || /^[a-f\d]{24}$/i.test(doc.parentCategory)).toBe(true);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.translations[0].name;

    const doc = new category(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors['translations.0.name']).toBeDefined();
  });
});