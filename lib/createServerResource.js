/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const replace = require('replace-in-file');
const renameFileNames = require('./renameFileNames');
const replaceInFile = require('./replaceInFile');
const splitKebabTextIntoCases = require('./splitKebabTextIntoCases');

const packageDirectory = path.dirname(__dirname);
const projectDirectory = path.dirname(process.cwd());

console.log(`packageDirectory: ${packageDirectory}`);
console.log(`projectDirectory: ${projectDirectory}`);

const createService = async ({ name, pluralName, source, pluralSource }) => {
  try {
    console.log(`Registering ${name.pascal} service`);

    const newServicePath = `${projectDirectory}/server/src/services/${name.kebab}`;
    fse.copySync(
      `${packageDirectory}/src/services/${source.kebab}`,
      newServicePath,
    );

    console.log(`Created ${name.pascal} service`);

    await replaceInFile({
      name,
      source,
      pluralName,
      pluralSource,
      files: `${newServicePath}/**`,
    });

    await renameFileNames({
      name,
      source,
      pluralName,
      pluralSource,
      dir: `${newServicePath}/lib`,
    });

    return newServicePath;
  } catch (exception) {
    throw new Error(
      `[createServerResource.createService] ${exception.message}`,
    );
  }
};

const registerApiRoute = async ({ pluralName }) => {
  try {
    console.log(`Registering ${pluralName.kebab} route`);

    const importPlaceholder = `// MEADOW: Import`;
    const importRegExp = new RegExp(importPlaceholder, 'g');

    const registerPlaceholder = `// MEADOW: Register`;
    const registerRegExp = new RegExp(registerPlaceholder, 'g');

    const results = await replace({
      files: `${projectDirectory}/server/src/api/index.js`,
      from: [importRegExp, registerRegExp],
      to: [
        `import ${pluralName.camel} from './routes/${pluralName.kebab}';
${importPlaceholder}`,
        `${pluralName.camel}(app);
${registerPlaceholder}`,
      ],
      countMatches: true,
    });
    console.log('Replacement results:', results);
    return results;
  } catch (exception) {
    throw new Error(
      `[createServerResource.registerRoute] ${exception.message}`,
    );
  }
};

const createApiRoute = async ({ name, source, pluralName, pluralSource }) => {
  try {
    const newRoutesPath = `${projectDirectory}/server/src/api/routes/${pluralName.kebab}.js`;
    fse.copySync(
      `${packageDirectory}/src/api/routes/${pluralSource.kebab}.js`,
      newRoutesPath,
    );
    console.log(`Created ${name.kebab} routes`);

    await replaceInFile({
      name,
      source,
      pluralName,
      pluralSource,
      files: newRoutesPath,
    });

    await registerApiRoute({ pluralName });

    return newRoutesPath;
  } catch (exception) {
    throw new Error(
      `[createServerResource.createApiRoute] ${exception.message}`,
    );
  }
};

const createModel = async ({ name, source, pluralName, pluralSource }) => {
  try {
    const newModelPath = `${projectDirectory}/server/src/models/${name.pascal}.js`;
    fse.copySync(
      `${packageDirectory}/src/models/${source.pascal}.js`,
      newModelPath,
    );
    console.log(`Created ${name.pascal} model`);
    await replaceInFile({
      name,
      source,
      pluralName,
      pluralSource,
      files: newModelPath,
    });
    return newModelPath;
  } catch (exception) {
    throw new Error(`[createServerResource.createModel] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.name) throw new Error('options.name is required.');
  } catch (exception) {
    throw new Error(
      `[createServerResource.validateOptions] ${exception.message}`,
    );
  }
};

const createServerResource = async (options) => {
  try {
    validateOptions(options);

    console.log(options);

    const name = splitKebabTextIntoCases(options.name);
    const pluralName = splitKebabTextIntoCases(
      options.pluralName ? options.pluralName : `${options.name}s`,
    );

    const source = splitKebabTextIntoCases('red-fox');
    const pluralSource = splitKebabTextIntoCases('red-foxes');

    await createModel({ name, source, pluralName, pluralSource });
    await createApiRoute({ name, source, pluralName, pluralSource });
    await createService({ name, source, pluralName, pluralSource });
  } catch (exception) {
    throw new Error(`[createServerResource] ${exception.message}`);
  }
};

module.exports = createServerResource;
