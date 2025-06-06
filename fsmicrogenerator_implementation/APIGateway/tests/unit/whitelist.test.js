// Auto-generated unit tests for whitelist
const whitelist = require("../../models/whitelist.model");

describe("whitelist Model Unit Tests", () => {
  const baseData = {
    type: "ip",
    key: "127.0.0.1",
    rateLimit: {
      window: 600,
      limit: 1000
    }
  };

  it("should create a valid whitelist object", () => {
    const doc = new whitelist(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.type).toBe("string");
    expect(['ip','user'].includes(doc.type)).toBe(true);
    expect(typeof doc.key).toBe("string");
    expect(typeof doc.rateLimit).toBe('object');
    expect(typeof doc.rateLimit.window).toBe('number');
    expect(typeof doc.rateLimit.limit).toBe('number');
  });

  it("should fail validation if required fields are missing", async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.type;
    delete data.key;
    delete data.rateLimit.window;
    delete data.rateLimit.limit;

    const doc = new whitelist(data);
    let err;
    try {
      await doc.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty("type");
    expect(err.errors).toHaveProperty("key");
    expect(err.errors["rateLimit.window"]).toBeDefined();
    expect(err.errors["rateLimit.limit"]).toBeDefined();
  });
});
