const fs = require("fs");
const path = require("path");
const serviceRegistry = require("../models/serviceRegistry.model");
/**
 * Generates services.json file for Prometheus
 */
exports.generatePrometheusTargets = async (
  serviceDocs = [],
  outputPath = null
) => {
  try {
    if (!serviceDocs.length) serviceDocs = await serviceRegistry.find().lean();
    const prometheusEntries = process.env.SERVICENAME ?  [{ targets: [`${process.env.HOST}:${process.env.PORT}`], labels: { job: `${process.env.SERVICENAME}` } }] : [];

    for (const service of serviceDocs) {
      const jobName = `${service.serviceName}_service`;

      const enabledTargets = (service.instances || [])
        .filter((inst) => inst.status === "enabled")
        .map((inst) => `${inst.host}:${inst.port}`);

      if (enabledTargets.length > 0) {
        prometheusEntries.push({
          targets: enabledTargets,
          labels: { job: jobName }
        });
      }
    }

    if (!outputPath) {
      outputPath = path.join(__dirname, "../targets/services.json");
    }
    console.info(
      `✅ [Prometheus] services.json generated with ${prometheusEntries.length} jobs`
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(prometheusEntries, null, 2));

  } catch (error) {
    console.error(
      `An error occured while generating [Prometheus] services.json===>, ${error.message}`
    );
  }
};