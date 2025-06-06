// Auto-generated unit tests for user
const mongoose = require('mongoose');
const user = require('../../models/user.model');

describe('user Model Unit Tests', () => {
  const baseData = {
    reference: "5KCeZthA56",
    pseudo: "08xYVZ7k",
    email: "user_email@gmail.com",
    pwCrypte: "J3UKHKPk",
    salutation: "code_1232",
    translations: [{
        language: "en",
        nom: "DvnUk5az",
        prenom: "IjOKxjhw"
      }],
    fonction: "bb91d00252044192081bad9f",
    photo: "wtX9hQhm",
    telephone: "oCgA9bhr",
    fixe: "rFyw7wRP",
    nbreConnection: 705,
    dateDerniereConnexion: new Date("2025-05-12T22:02:44.481Z"),
    etatCompte: "code_10577",
    etatObjet: "code-1",
    groupe: "f47745e183549f8f301c93e4",
    historiqueConnexion: [],
  };

  it('should create a valid user object', () => {
    const doc = new user(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.reference).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.fonction === 'object' || /^[a-f\d]{24}$/i.test(doc.fonction)).toBe(true);
    expect(typeof doc.nbreConnection).toBe('number');
    expect(doc.dateDerniereConnexion).toBeInstanceOf(Date);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.reference;
    delete data.pseudo;
    delete data.email;
    delete data.pwCrypte;
    delete data.salutation;
    delete data.translations[0].nom;
    delete data.translations[0].prenom;
    delete data.fonction;
    delete data.telephone;
    delete data.etatCompte;
    delete data.groupe;

    const doc = new user(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('reference');
expect(err.errors).toHaveProperty('pseudo');
expect(err.errors).toHaveProperty('email');
expect(err.errors).toHaveProperty('pwCrypte');
expect(err.errors).toHaveProperty('salutation');
expect(err.errors['translations.0.nom']).toBeDefined();
expect(err.errors['translations.0.prenom']).toBeDefined();
expect(err.errors).toHaveProperty('fonction');
expect(err.errors).toHaveProperty('telephone');
expect(err.errors).toHaveProperty('etatCompte');
expect(err.errors).toHaveProperty('groupe');
  });

  it('should fail validation if salutation is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.salutation = "INVALID_ENUM";
    const doc = new user(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['salutation'].kind).toBe('enum');
  });
});