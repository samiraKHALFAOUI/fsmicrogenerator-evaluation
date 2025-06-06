// Auto-generated unit tests for group
const mongoose = require("mongoose");
const group = require("../../models/group.model");

describe("group Model Unit Tests", () => {
  const baseData = {
    etatObjet: "code-1",
    etatUtilisation: "code_4316",
    translations: [
      {
        language: "en",
        designation: "J4odbsqr"
      }
    ],
    espaces: [],
    users: ["faf314190be6da9e195694df"],
    superGroup: true
  };

  it("should create a valid group object", () => {
    const doc = new group(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.etatObjet).toBe("string");
    expect(doc.translations).toBeInstanceOf(Array);
    expect(typeof doc.superGroup).toBe("boolean");
  });

  it("should fail validation if required fields are missing", async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.translations[0].designation;

    const doc = new group(data);
    let err;
    try {
      await doc.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors["translations.0.designation"]).toBeDefined();
  });

  it("should fail validation if etatUtilisation is not in enum", async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    data.etatUtilisation = "INVALID_ENUM";
    const doc = new group(data);
    let err;
    try {
      await doc.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors["etatUtilisation"].kind).toBe("enum");
  });
});
