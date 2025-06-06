// Auto-generated unit tests for domain
const mongoose = require('mongoose');
const domain = require('../../models/domain.model');

describe('domain Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    code: "myZUBCYW",
    logo: "./file/domain/logo.png",
    translations: [{
      language: "en",
      designation: "F1Mz2Y46",
      description: "FgsQiX6a"
    }],
    hasTaxonomies: false,
    parent: "e57e33af09240d0df10c2564",
    children: ["54cb60c3dc86009f1cbd5495"],
    taxonomies: ["c05e17f27163f9850360def3"],
  };

  it('should create a valid domain object', () => {
    const doc = new domain(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.hasTaxonomies).toBe('boolean');
    expect(typeof doc.parent === 'object' || /^[a-f\d]{24}$/i.test(doc.parent)).toBe(true);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.code;
    delete data.translations[0].designation;

    const doc = new domain(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('code');
    expect(err.errors['translations.0.designation']).toBeDefined();
  });
});