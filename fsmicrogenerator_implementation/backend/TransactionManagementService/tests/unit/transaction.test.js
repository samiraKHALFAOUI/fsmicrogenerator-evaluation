// Auto-generated unit tests for transaction
const mongoose = require('mongoose');
const transaction = require('../../models/transaction.model');

describe('transaction Model Unit Tests', () => {
  const baseData = {
    etatObjet: "code-1",
    reference: "yQnn1r8v",
    type: "code_18440",
    registrationDate: new Date("2025-05-12T14:54:52.583Z"),
    status: "code_1166",
    savedBy: "28fbb47e0b10701c21cfc0e1",
    transactionLines: ["56660a1a8c930ad5cc167c6d"],
    supplier: "1142dd6c65b4abbf76231287",
    customer: "c2d269e6d3f7e10d7f5004f5",
  };

  it('should create a valid transaction object', () => {
    const doc = new transaction(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe('string');
    expect(doc.registrationDate).toBeInstanceOf(Date);
    expect(typeof doc.savedBy === 'object' || /^[a-f\d]{24}$/i.test(doc.savedBy)).toBe(true);
    expect(doc.transactionLines).toBeInstanceOf(Array);
  });

  it('should fail validation if required fields are missing', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.reference;
    delete data.type;
    delete data.registrationDate;
    delete data.status;
    delete data.savedBy;

    const doc = new transaction(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err).toBeDefined();
expect(err.errors).toHaveProperty('reference');
expect(err.errors).toHaveProperty('type');
expect(err.errors).toHaveProperty('registrationDate');
expect(err.errors).toHaveProperty('status');
expect(err.errors).toHaveProperty('savedBy');
  });

  it('should fail validation if type is not in enum', async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.type = "INVALID_ENUM";
    const doc = new transaction(data);
    let err;
    try { await doc.validate(); } catch (e) { err = e; }
    expect(err.errors['type'].kind).toBe('enum');
  });
});