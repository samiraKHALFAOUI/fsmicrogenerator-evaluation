// Auto-generated unit tests for taxonomy
const mongoose = require('mongoose');
const taxonomy = require('../../models/taxonomy.model');

describe('taxonomy Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    logo: "./file/taxonomy/logo.png",
    translations: [{
      language: "en",
      designation: "rHi2J5Nq",
      description: "MBhGaa8h"
    }],
    domain: "0dda9a8e364c8973ae33ba17",
    parent: "186fd3d05b9be0702618739d",
    children: ["15558794c3e7261f64191bb5"],
  };

  it('should create a valid taxonomy object', () => {
    const doc = new taxonomy(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.domain === 'object' || /^[a-f\d]{24}$/i.test(doc.domain)).toBe(true);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.translations[0].designation;

    const doc = new taxonomy(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors['translations.0.designation']).toBeDefined();
  });
});