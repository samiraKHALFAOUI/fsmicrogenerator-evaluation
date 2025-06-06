// Auto-generated unit tests for currency
const mongoose = require('mongoose');
const currency = require('../../models/currency.model');

describe('currency Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    currency: "1qvx8cFA",
    typeCurrency: "code_3630",
    symbolCurrency: "Q40hYcop",
    exchangeRates: ["a1d204917fd4cec501d0f01e"],
  };

  it('should create a valid currency object', () => {
    const doc = new currency(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.exchangeRates).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.currency;
    delete data.typeCurrency;

    const doc = new currency(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('currency');
expect(err.errors).toHaveProperty('typeCurrency');
  });

  it('should fail validation if typeCurrency is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.typeCurrency = "INVALID_ENUM";
    const doc = new currency(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['typeCurrency'].kind).toBe('enum');
  });
});