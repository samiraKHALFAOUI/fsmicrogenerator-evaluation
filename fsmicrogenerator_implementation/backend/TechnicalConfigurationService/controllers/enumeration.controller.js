const fs = require("fs");
const prettier = require("prettier");
const {
  Handler,
  sortStringByNumericPart,
  getDiffArray
} = require("../helpers/helpers");

const logger = require("../middlewares/winston.middleware");
const {
  AddData,
  AddMany,
  FindAll,
  FindById,
  FindOne,
  GetTranslation,
  UpdateData,
  UpdateMany,
  ChangeState,
  TranslateData,
  GetStatistiques,
  DeleteData
} = require("../models/repositories/enumeration.repositorie");
const enumeration = require("../models/enumeration.model");
const populate = "";

exports.loadEnumValues = async (req, res) => {
  try {
    const path = `${__dirname.split(process.env.PREFIX)[0]}${process.env.I18NADMINCLIENTSIDE
      }`;

    let data = [];
    if (fs.existsSync(path)) {
      let content = fs.readdirSync(path);

      for (let file of content) {
        if (fs.statSync(`${path}/${file}`).isFile() && file.endsWith(".json")) {
          let result = JSON.parse(fs.readFileSync(`${path}/${file}`, "utf-8"));
          let lang = file.replace(".json", "");
          Object.keys(result).map((v) => {
            let index = data.findIndex((d) => d.code === v);
            if (index === -1)
              data.push({
                code: v,
                translations: [
                  {
                    language: lang,
                    valeur: result[v]
                  }
                ],
                etatValidation: "code_223"
                // actif: true
              });
            else
              data[index].translations.push({
                language: lang,
                valeur: result[v]
              });
          });
        }
      }
    }
    if (data.length) {
      let existingValues = await FindAll(
        req,
        "",
        {},
        { queryOptions: { select: "code -_id" } }
      );
      existingValues = existingValues.map((v) => v.code);

      data = data.filter((d) => !existingValues.includes(d.code));
      if (data.length) {
        req.body = data;
        data = await AddMany(req, "");
      }
    }
    res.status(200).send(sortStringByNumericPart(data, "code"));
  } catch (err) {
    logger.error(`error while retriving i18n content : ${err}`);
    return res.status(400).send(err);
  }
};

async function generateI18nFiles(i18ns) {
  try {
    let i18nTemplateFile = {};

    let recF = (i18nObject, path, i18n, lang) => {
      let [parent, ...child] = path.split(".");

      if (child.length) {
        if (!i18nObject[parent]) i18nObject[parent] = {};
        recF(i18nObject[parent], child.join("."), i18n, lang);
      } else {
        i18nObject[parent] = i18n.translations.find(
          (i) => i.language === lang
        ).valeur;
      }
    };
    i18ns?.map((i18n) => {
      if (!(i18n.translations instanceof Array) && i18n.translations.lang)
        i18n.translations = [i18n.translations];
      if (i18n.translations instanceof Array)
        i18n.translations.map((lan) => {
          let lang = lan.language;
          if (!i18nTemplateFile[lang]) i18nTemplateFile[lang] = {};
          recF(i18nTemplateFile[lang], i18n.code, i18n, lang);
        });
    });
    let languages = Object.keys(i18nTemplateFile);
    for (let lang of languages) {
      const path = `${__dirname.split(process.env.PREFIX)[0]}${process.env.I18NADMINCLIENTSIDE
        }`;
      const pathBuild = `${__dirname.split(process.env.PREFIX)[0]}${process.env.I18NADMINBUILDCLIENTSIDE
        }`;

      let data = await prettier.format(JSON.stringify(i18nTemplateFile[lang]), {
        parser: "json"
      });
      fs.writeFileSync(`${path}${lang}2.json`, data);
      if (!fs.existsSync(pathBuild))
        fs.mkdirSync(pathBuild, { recursive: true });
      fs.writeFileSync(`${pathBuild}${lang}2.json`, data);
    }
    return languages;
  } catch (error) {
    logger.error(`error while generating i18n Files==> ${error}`);
    throw {
      error: true,
      message: "error while generating i18n Files==>",
      detail: error.message || error
    };
  }
}

exports.generateEnumValues = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    if (!params.condition) params.condition = { etatValidation: "code_4268" };

    delete req.headers[process.env.LANGUAGE_FIELD_NAME];
    delete req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
    let data = await FindAll(req, populate, params.condition, params.options);

    data = sortStringByNumericPart(data, "code");
    data = await generateI18nFiles(data);
    res.status(200).send({ message: "generation success", data });
  } catch (err) {
    logger.error(`error while retriving i18n content: ${err}`);
    return res.status(400).send(err);
  }
};

exports.addMissingEnumerations = async (req, res) => {
  try {
    let savedData = await AddMany(req, populate);
    let params = JSON.parse(req.query.params || "{}");
    if (!params.condition) params.condition = { etatValidation: "code_4268" };

    delete req.headers[process.env.LANGUAGE_FIELD_NAME];
    delete req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
    let data = await FindAll(req, populate, params.condition, params.options);

    data = sortStringByNumericPart(data, "code");
    data = await generateI18nFiles(data);
    res.status(200).send(savedData);
  } catch (err) {
    logger.error(`error while add missing enumeration: ${err}`);
    return res.status(400).send(err);
  }
};

exports.filterEnumValues = async (req, res) => {
  try {
    const mainPath = `${__dirname.split(process.env.PREFIX)[0]}${process.env.PREFIX
      }`;
    let usedValues = new Set();

    const getFileEnumValues = async (fullPath) => {
      try {
        const stats = fs.statSync(fullPath);

        if (
          stats.isFile() &&
          !fullPath.endsWith(".spec.ts") &&
          !fullPath.endsWith(".css")
        ) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const matches = content.match(/code[-_][\d]+/g) || [];
          usedValues = new Set([...usedValues, ...matches]);
        } else if (stats.isDirectory()) {
          const contentDir = fs.readdirSync(fullPath);
          await Promise.all(
            contentDir.map((item) => getFileEnumValues(`${fullPath}/${item}`))
          );
        }
      } catch (err) {
        logger.error(`Error while reading file/directory: ${err}`);
      }
    };

    const readEnum = async () => {
      const backendPath = `${mainPath}/admin/backend`;
      const services = fs.readdirSync(backendPath);
      await Promise.all(
        services.map(async (service) => {
          const servicePath = `${backendPath}/${service}`;
          if (fs.statSync(servicePath).isDirectory()) {
            await Promise.all([
              getFileEnumValues(`${servicePath}/models`),
              getFileEnumValues(`${servicePath}/controllers`)
            ]);
          }
        })
      );

      await getFileEnumValues(`${mainPath}/admin/frontend/src/app`);
    };

    await readEnum();

    usedValues = [...usedValues];
    let data = await FindAll(req, populate, "", {
      queryOptions: { select: "code -_id" }
    });
    data = data.map((item) => item.code);
    let missing = getDiffArray(usedValues, data);
    let unused = getDiffArray(data, usedValues);
    enumeration.updateMany(
      { code: { $in: unused } },
      { $set: { etatValidation: "code_1809" } }
    );
    data = await FindAll(req, populate, "");
    res.status(200).send({ data, usedValues, missing, unused });
  } catch (err) {
    logger.error(`Error while retrieving enum values: ${err}`);
    return res.status(400).send(err);
  }
};
function cleanEnumeration(data, path, deletedItems) {
  try {
    if (fs.existsSync(path)) {
      let i18nFiles = fs.readdirSync(path);
      for (let file of i18nFiles) {
        let subPath = `${path}${file}`;
        if (fs.statSync(subPath).isFile() && file.endsWith("2.json")) {
          let content = JSON.parse(fs.readFileSync(subPath));
          data.map((d) => {
            if (content.hasOwnProperty(d)) {
              deletedItems.push(`${d}:${content[d]}`);
              delete content[d];
            }
          });
          fs.writeFileSync(
            subPath,
            prettier.format(JSON.stringify(content), { parser: "json" })
          );
        }
      }
    }
  } catch (error) {
    logger.error(`error while cleaning ${path}===>${error}`);
    throw {
      error: true,
      message: `error while cleaning ${path}===`,
      detail: error.message || error
    };
  }
}

exports.deleteUnusedEnumeration = async (req, res) => {
  try {
    const path = `${__dirname.split(process.env.PREFIX)[0]}${process.env.I18NADMINCLIENTSIDE
      }`;
    const pathBuild = `${__dirname.split(process.env.PREFIX)[0]}${process.env.I18NADMINBUILDCLIENTSIDE
      }`;
    let deletedItems = [];
    await Promise.all([
      cleanEnumeration(req.body, path, deletedItems),
      cleanEnumeration(req.body, pathBuild, deletedItems)
    ]);

    return res.status(200).send(deletedItems);
  } catch (error) {
    logger.error(`error while cleaning deleteUnusedEnumeration`);
    return res.status(400).send(error);
  }
};

/**
 *
 * @type {Handler}
 */
exports.add = async (req, res) => {
  try {
    let data = await AddData(req, populate);
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.addMany = async (req, res) => {
  try {
    let data = await AddMany(req, populate);
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getAll = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    if (params.hasOwnProperty("translate") && params.translate) {
      delete req.headers[process.env.LANGUAGE_FIELD_NAME];
      delete req.headers[process.env.DEFAULT_LANGUAGE_FIELD_NAME];
      delete params.translate;
    }

    let data = await FindAll(req, populate, params.condition, params.options);
    data = sortStringByNumericPart(data, "code");
    return res.status(200).send(data);
  } catch (err) {
    logger.error(err);
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getById = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindById(req, populate, params.options);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getOne = async (req, res) => {
  try {
    let params = JSON.parse(req.query.params || "{}");
    let data = await FindOne(req, populate, params.condition, params.options);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.update = async (req, res) => {
  try {
    let data = await UpdateData(req, populate);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.updateMany = async (req, res) => {
  try {
    let data = await UpdateMany(req, populate);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getTranslations = async (req, res) => {
  try {
    let data = await GetTranslation(req);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.translateData = async (req, res) => {
  try {
    let data = await TranslateData(req);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.updateState = async (req, res) => {
  try {
    let data = await ChangeState(req);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.delete = async (req, res) => {
  try {
    let data = await DeleteData({ _id: { $in: [req.params.id] } });
    return res.status(204).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 *
 * @type {Handler}
 */
exports.getStatistique = async (req, res) => {
  try {
    let data = await GetStatistiques(req.body);
    return res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};
