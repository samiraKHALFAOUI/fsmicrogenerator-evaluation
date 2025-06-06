// Auto-generated unit tests for exchangeRate
const mongoose = require('mongoose');
const exchangeRate = require('../../models/exchangeRate.model');

describe('exchangeRate Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    date: new Date("2025-05-13T02:26:53.326Z"),
    refCurrencyBase: "12686f513c117808f5f2636f",
    refCurrencyEtrangere: "472ad2917666184990e95573",
    valeurAchat: 36,
    valeurVente: 828,
    actif: true,
    currency: ["1c9eae0606249dcfa33fb8a4"],
  };

  it('should create a valid exchangeRate object', () => {
    const doc = new exchangeRate(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.date).toBeInstanceOf(Date);
    expect(typeof doc.refCurrencyBase === 'object' || /^[a-f\d]{24}$/i.test(doc.refCurrencyBase)).toBe(true);
    expect(typeof doc.valeurAchat).toBe('number');
    expect(typeof doc.actif).toBe('boolean');
    expect(doc.currency).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.refCurrencyBase;
    delete data.refCurrencyEtrangere;

    const doc = new exchangeRate(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('refCurrencyBase');
expect(err.errors).toHaveProperty('refCurrencyEtrangere');
  });
});