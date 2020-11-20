/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const replace = require('replace-in-file');
const { capitalize, pluralize } = require('@homamo/meadow-utils');

const packageDirectory = path.dirname(__dirname);
const projectDirectory = path.dirname(process.cwd());

console.log(`packageDirectory: ${packageDirectory}`);
console.log(`projectDirectory: ${projectDirectory}`);

const inFileReplace = async ({
  name,
  source,
  pluralName,
  pluralSource,
  files,
}) => {
  try {
    console.log(`Replacing ${source} with ${name} in ${files}`);
    const lowerPluralSourceRegExp = new RegExp(pluralSource, 'g');
    const capPluralSourceRegExp = new RegExp(capitalize(pluralSource), 'g');

    const lowerSourceRegExp = new RegExp(source, 'g');
    const capSourceRegExp = new RegExp(capitalize(source), 'g');

    const results = await await replace({
      files,
      from: [
        lowerPluralSourceRegExp,
        capPluralSourceRegExp,
        lowerSourceRegExp,
        capSourceRegExp,
      ],
      to: [pluralName, capitalize(pluralName), name, capitalize(name)],
    });
    console.log('Replacement results:', results);
    return results;
  } catch (exception) {
    throw new Error(
      `[createServerResource.inFileReplace] ${exception.message}`,
    );
  }
};

const renameFileNames = async ({
  name,
  source,
  pluralName,
  pluralSource,
  dir,
}) => {
  try {
    let files = fse.readdirSync(dir);
    const pluralMatch = RegExp(pluralSource, 'g');
    const match = RegExp(source, 'g');

    files
      .filter((file) => file.match(pluralMatch))
      .forEach((file) => {
        const filePath = path.join(dir, file);
        const newFilePath = path.join(
          dir,
          file.replace(pluralMatch, pluralName),
        );

        fse.renameSync(filePath, newFilePath);
      });

    // Re-read as some files are renamed
    files = fse.readdirSync(dir);

    files
      .filter((file) => file.match(match))
      .forEach((file) => {
        const filePath = path.join(dir, file);
        const newFilePath = path.join(dir, file.replace(match, name));

        fse.renameSync(filePath, newFilePath);
      });
    return files.length;
  } catch (exception) {
    throw new Error(
      `[createServerResource.renameFileNames] ${exception.message}`,
    );
  }
};

const createService = async ({ name, source, pluralName, pluralSource }) => {
  try {
    console.log(`Registering ${capitalize(name)} service`);
    const newServicePath = `${projectDirectory}/server/src/services/${name}`;
    fse.copySync(`${packageDirectory}/src/services/${source}`, newServicePath);
    console.log(`Created ${name} service`);
    await inFileReplace({
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
    await renameFileNames({
      name: capitalize(name),
      source: capitalize(source),
      pluralName: capitalize(pluralName),
      pluralSource: capitalize(pluralSource),
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
    console.log(`Registering ${pluralName} route`);

    const importPlaceholder = `// MEADOW: Import`;
    const importRegExp = new RegExp(importPlaceholder, 'g');

    const registerPlaceholder = `// MEADOW: Register`;
    const registerRegExp = new RegExp(registerPlaceholder, 'g');

    const results = await replace({
      files: `${projectDirectory}/server/src/api/index.js`,
      from: [importRegExp, registerRegExp],
      to: [
        `import ${pluralName} from './routes/${pluralName}';
${importPlaceholder}`,
        `${pluralName}(app);
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
    const newRoutesPath = `${projectDirectory}/server/src/api/routes/${pluralName}.js`;
    fse.copySync(
      `${packageDirectory}/src/api/routes/${pluralSource}.js`,
      newRoutesPath,
    );
    console.log(`Created ${name} routes`);
    await inFileReplace({
      name,
      source,
      files: newRoutesPath,
      pluralName,
      pluralSource,
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
    const newModelPath = `${projectDirectory}/server/src/models/${capitalize(
      name,
    )}.js`;
    fse.copySync(
      `${packageDirectory}/src/models/${capitalize(source)}.js`,
      newModelPath,
    );
    console.log(`Created ${capitalize(name)} model`);
    await inFileReplace({
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

    const { name } = options;
    const source = 'red-fox';
    const pluralName = pluralize(name);
    const pluralSource = pluralize(source);

    await createModel({ name, source, pluralName, pluralSource });
    await createApiRoute({ name, source, pluralName, pluralSource });
    await createService({ name, source, pluralName, pluralSource });
  } catch (exception) {
    throw new Error(`[createServerResource] ${exception.message}`);
  }
};

module.exports = createServerResource;
