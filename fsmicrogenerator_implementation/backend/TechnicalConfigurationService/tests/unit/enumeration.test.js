// Auto-generated unit tests for enumeration
const mongoose = require('mongoose');
const enumeration = require('../../models/enumeration.model');

describe('enumeration Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    code: "YDuIJcpE",
    translations: [{
        language: "en",
        valeur: "q7uSIlOC",
        commentaire: "8pBLqosx"
      }],
    etatValidation: "code_223",
  };

  it('should create a valid enumeration object', () => {
    const doc = new enumeration(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.code;
    delete data.translations[0].valeur;
    delete data.etatValidation;

    const doc = new enumeration(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('code');
expect(err.errors['translations.0.valeur']).toBeDefined();
expect(err.errors).toHaveProperty('etatValidation');
  });

  it('should fail validation if etatValidation is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.etatValidation = "INVALID_ENUM";
    const doc = new enumeration(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['etatValidation'].kind).toBe('enum');
  });
});