// Auto-generated unit tests for serviceRegistry
const serviceRegistry = require("../../models/serviceRegistry.model");

describe("serviceRegistry Model Unit Tests", () => {
  const baseData = {
    serviceName: "accountManagement",
    index: 0,
    instances: {
      serviceName: "accountManagement",
      protocol: "https",
      host: "127.0.0.1",
      port: "4001",
      role: [],
      url: "https://127.0.0.1:4001/accountManagement"
    }
  };

  it("should create a valid serviceRegistry object", () => {
    const doc = new serviceRegistry(baseData);
    expect(doc).toBeDefined();
    expect(typeof doc.serviceName).toBe("string");
    expect(typeof doc.index).toBe("number");
    expect(doc.instances).toBeInstanceOf(Array);
    expect(doc.instances[0].status === "enabled").toBe(true);
    expect(doc.loadBalanceStrategy === "ROUND_ROBIN").toBe(true);
  });

  it("should fail validation if required fields are missing", async () => {
    const data = JSON.parse(JSON.stringify(baseData));
    delete data.serviceName;
    delete data.instances.serviceName;
    delete data.instances.protocol;
    delete data.instances.host;
    delete data.instances.port;

    const doc = new serviceRegistry(data);
    let err;
    try {
      await doc.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty("serviceName");
    expect(err.errors["instances.0.serviceName"]).toBeDefined();
    expect(err.errors["instances.0.protocol"]).toBeDefined();
    expect(err.errors["instances.0.host"]).toBeDefined();
    expect(err.errors["instances.0.port"]).toBeDefined();
  });
});
