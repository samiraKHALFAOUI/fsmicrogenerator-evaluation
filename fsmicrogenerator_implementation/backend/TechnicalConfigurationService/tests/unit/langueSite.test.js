// Auto-generated unit tests for langueSite
const mongoose = require('mongoose');
const langueSite = require('../../models/langueSite.model');

describe('langueSite Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    code: "g8ZP5fBP",
    translations: [{
        language: "en",
        value: "daunuK0S",
        commentaire: "70dg5vui"
      }],
    flag: "uynmNsOO",
    actif: false,
    ordreAffichage: 329,
    langueParDefault: false,
  };

  it('should create a valid langueSite object', () => {
    const doc = new langueSite(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.actif).toBe('boolean');
    expect(typeof doc.ordreAffichage).toBe('number');
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.code;
    delete data.translations[0].value;
    delete data.actif;
    delete data.ordreAffichage;
    delete data.langueParDefault;

    const doc = new langueSite(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('code');
expect(err.errors['translations.0.value']).toBeDefined();
expect(err.errors).toHaveProperty('actif');
expect(err.errors).toHaveProperty('ordreAffichage');
expect(err.errors).toHaveProperty('langueParDefault');
  });
});