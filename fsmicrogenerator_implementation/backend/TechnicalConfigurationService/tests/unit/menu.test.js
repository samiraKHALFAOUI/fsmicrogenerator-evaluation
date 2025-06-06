// Auto-generated unit tests for menu
const mongoose = require('mongoose');
const menu = require('../../models/menu.model');

describe('menu Model Unit Tests', () => {
  const baseData = {
    etatDePublication: "code_541",
    etatObjet: "code-1",
    translations: [{
      language: "en",
      titre: "PA80jxyT"
    }],
    planPrincipale: true,
    megaMenu: true,
    icon: "./file/menu/icon.png",
    ordre: 99,
    priorite: 286,
    path: "IRsu413A",
    typeAffichage: "code_13884",
    showAll: false,
    nbrElement: 785,
    typeSelect: "code_13897",
    typeActivation: "code_1960",
    periodeActivation: [{
      dateDebut: new Date("2025-05-13T03:30:38.004Z"),
      dateFin: new Date("2025-05-13T06:43:08.032Z")
    }],
    periodiciteActivation: {},
    elementAffiche: ["75950eaec8f70cbc5525ade4"],
    menuParent: "2d48c169335ffb987bba72ab",
    menuAssocies: ["9e021af6490c4b07709d9072"],
    menuPrincipal: true,
    actif: false,
    serviceConfig: {
      service: "zYMTMHNE",
      classe: "XMFZklIO",
      option: "sample_option"
    },
    type: "code_13934",
  };

  it('should create a valid menu object', () => {
    const doc = new menu(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatDePublication).toBe('string');
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.planPrincipale).toBe('boolean');
    expect(typeof doc.ordre).toBe('number');
    expect(typeof doc.periodiciteActivation).toBe('object');
    expect(typeof doc.menuParent === 'object' || /^[a-f\d]{24}$/i.test(doc.menuParent)).toBe(true);
    expect(typeof doc.serviceConfig).toBe('object');
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.etatDePublication;
    delete data.translations[0].titre;
    delete data.planPrincipale;
    delete data.megaMenu;
    delete data.ordre;
    delete data.priorite;
    delete data.typeActivation;
    delete data.menuPrincipal;
    delete data.actif;
    delete data.type;

    const doc = new menu(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('etatDePublication');
    expect(err.errors['translations.0.titre']).toBeDefined();
    expect(err.errors).toHaveProperty('planPrincipale');
    expect(err.errors).toHaveProperty('megaMenu');
    expect(err.errors).toHaveProperty('ordre');
    expect(err.errors).toHaveProperty('priorite');
    expect(err.errors).toHaveProperty('typeActivation');
    expect(err.errors).toHaveProperty('menuPrincipal');
    expect(err.errors).toHaveProperty('actif');
    expect(err.errors).toHaveProperty('type');
  });

  it('should fail validation if etatDePublication is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.etatDePublication = "INVALID_ENUM";
    const doc = new menu(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['etatDePublication'].kind).toBe('enum');
  });
});