const fs = require('fs');
const prettier = require('prettier');
const { GroupBy } = require('./helpers');

function replaceCaractereWithTitleCase(str, caractere = '.') {
   if (!str || typeof str !== 'string' || !str.trim().length) return str;
   str = str.trim();
   if (caractere === '.') str = str.replace(/\./g, ' ');
   else if (caractere === '-') str = str.replace(/-/g, ' ');
   let newStr = str[0].toUpperCase() + str.slice(1).replace(/\s+(\w)/g, (match) => match.trim().toUpperCase());
   return newStr.replace(/'/g, '');
}

function camelCase(str) {
   if (!str || typeof str !== 'string' || !str.trim().length) return str;
   return str[0].toLowerCase() + str.slice(1).replace(/\s+(\w)/g, (match) => match.trim().toUpperCase());
}

function readFile(path, parser = 'typescript') {
   try {
      const content = fs.readFileSync(path, 'utf-8');
      return prettier.format(content, { parser });
   } catch (error) {
      logger.error(`error while reading file => ${path}`);
      throw error;
   }
}

function writeFile(path, content, parser = 'typescript') {
   try {
      content = prettier.format(content, { parser });
   } catch (error) {
      logger.error(`error while formatting => ${path}`);
   }
   fs.writeFileSync(path, content);
}

function copyFile(source, destination) {
   try {
      fs.copyFileSync(source, destination);
   } catch (error) {
      logger.error(`copy error from ${source} to ${destination}===>${error}`);
   }
}

let enumClasse = {};
let fileMatch = 0;
let enumCount = 0;

function updateModel(globalPath) {
   const services = fs.readdirSync(globalPath);
   for (const service of services) {
      const modelPath = `${globalPath}/${service}/models`;
      if (fs.existsSync(modelPath)) {
         const models = fs.readdirSync(modelPath);
         for (const model of models) {
            if (model.endsWith('.model.js')) {
               const path = `${modelPath}/${model}`;
               let content = fs.readFileSync(path, 'utf-8');
               let updated = false;

               content = content.replace(/(\w+)[\s\n:\[]+\{[^}]*enum[\s\n:\[]+([\w\W]*?)\]/g, (match, att, values) => {
                  updated = true;
                  enumCount++;
                  if (!enumClasse[att]) enumClasse[att] = { values: [], classes: [] };
                  const cleanValues = values.replace(/["']/g, '').split(',').map((v) => v.trim()).filter((v) => v && !['null', 'undefined'].includes(v));
                  enumClasse[att].values = [...new Set([...enumClasse[att].values, ...cleanValues])];
                  enumClasse[att].invalid = enumClasse[att].values.filter((v) => !/^code[_-]\d+$/.test(v));
                  enumClasse[att].classes.push({ service, classe: model.replace('.model.js', ''), attribut: att });
                  return match;
               });

               if (updated) fileMatch++;
            }
         }
      }
   }
}

function updateModelBackend(service, model, data) {
   const path = `../../backend/${service}/models/${model}.model.js`;
   if (!fs.existsSync(path)) return;
   let content = readFile(path);
   content = content.replace(/(new[\s\n]+Schema[{(\s\n]+)([\w\W]*?)(\w+Schema)/, (match, p0, body, p1) => {
      data.forEach((attr) => {
         const regex = new RegExp(`(${attr}[\s\n:[]+\{[^}]*)enum[\s\n:[]+([\w\W]*?)\]`, 'g');
         body = body.replace(regex, '$1');
      });
      body = body.replace(/,[\s\n]+,/g, ',').replace(/,[\s\n]+}/g, '}');
      return `${p0}${body}${p1}`;
   });
   writeFile(path, content);
}

function getListConfig(path, resultFiles) {
   const items = fs.readdirSync(path);
   for (const item of items) {
      const fullPath = `${path}/${item}`;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
         getListConfig(fullPath, resultFiles);
      } else if (item.startsWith('list-') && item.endsWith('component.ts')) {
         let content = readFile(fullPath, 'typescript');
         const headers = [], captionConfig = [];
         content.replace(/(this.headers[\w\W]*?)(\[[\w\W]*?\}[/*\s\n,]+\])/g, (match, head, conf) => {
            try {
               conf = conf.replace(/\$concat\w+/g, '').replace(/['`]/g, '"');
               headers.push(JSON.parse(conf));
            } catch {
               logger.error(`Invalid header: ${fullPath}`);
            }
            return match;
         });
         content.replace(/(this.captionConfig[\w\W]*?)(\{[\w\W]*?actions[\w\W]*?\}[,\s\n]+\})/g, (match, cap, conf) => {
            try {
               conf = conf.replace(/['`]/g, '"');
               captionConfig.push(JSON.parse(conf));
            } catch {
               logger.error(`Invalid caption: ${fullPath}`);
            }
            return match;
         });
         const parts = fullPath.replace('../../frontend/src/app/components/', '').split('/');
         resultFiles.push({
            serviceName: replaceCaractereWithTitleCase(parts[0], '-'),
            classeName: camelCase(replaceCaractereWithTitleCase(parts.at(-1).replace('list-', '').replace('.component.ts', ''), '-')),
            displayMode: 'table',
            captionConfig: captionConfig.length === 1 ? captionConfig[0] : captionConfig,
            listHeaders: headers.length === 1 ? headers[0] : headers
         });
      }
   }
}

module.exports = {
   getModelEnumeration() {
      updateModel('../../backend');
      const data = Object.entries(enumClasse).map(([key, val]) => ({
         etatDePublication: 'code_7229',
         code: key,
         valeurs: val.values,
         invalid: val.invalid?.length ? val.invalid : undefined,
         classeConcerne: val.classes
      }));
      const output = prettier.format(`const dataEnum=${JSON.stringify(data)}\n module.exports ={dataEnum}`, { parser: 'typescript' });
      fs.writeFileSync('../../backend/TechnicalConfigurationService/enumerationClasse.txt', output);
      return data;
   },
   applyEnumerationTransformation(data) {
      const grouped = GroupBy(data, 'classeConcerne.service');
      for (const [service, entries] of Object.entries(grouped)) {
         if (service === 'AccountManagementService') {
            const byClass = GroupBy(entries, 'classe');
            for (const [classe, attributes] of Object.entries(byClass)) {
               const attributs = attributes.map((e) => e.attribut);
               updateModelBackend(service, classe, attributs);
            }
         }
      }
   },
   async loadTableConfig() {
      const result = [];
      getListConfig('../../frontend/src/app/components', result);
      writeFile('../../backend/TechnicalConfigurationService/helpers/headers.ts', JSON.stringify(result));
      return result;
   }
};
