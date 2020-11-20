/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');

const renameFileNames = require('./renameFileNames');
const replaceInFile = require('./replaceInFile');
const splitKebabTextIntoCases = require('./splitKebabTextIntoCases');

const packageDirectory = path.dirname(__dirname);
const projectDirectory = path.dirname(process.cwd());

console.log(`packageDirectory: ${packageDirectory}`);
console.log(`projectDirectory: ${projectDirectory}`);

const createPages = async ({ name, pluralName, source, pluralSource }) => {
  try {
    console.log(`Creating ${name.kebab} pages`);
    const newPagesPath = `${projectDirectory}/client/src/pages/${name.kebab}`;
    fse.copySync(`${packageDirectory}/src/pages/${source.kebab}`, newPagesPath);
    console.log(`Created ${name.kebab} pages`);

    await replaceInFile({
      name,
      pluralName,
      source,
      pluralSource,
      files: `${newPagesPath}/**/**`,
    });

    await renameFileNames({
      name,
      pluralName,
      source,
      pluralSource,
      dir: `${newPagesPath}`,
    });

    return newPagesPath;
  } catch (exception) {
    throw new Error(`[createClientResource.createPages] ${exception.message}`);
  }
};

const createComponents = async ({ name, pluralName, source, pluralSource }) => {
  try {
    console.log(`Creating ${name.kebab} components`);
    const newComponentsPath = `${projectDirectory}/client/src/components/${name.kebab}`;
    fse.copySync(
      `${packageDirectory}/src/components/${source.kebab}`,
      newComponentsPath,
    );
    console.log(`Created ${name.kebab} components`);

    await replaceInFile({
      name,
      pluralName,
      source,
      pluralSource,
      files: `${newComponentsPath}/**/**`,
    });

    await renameFileNames({
      name,
      pluralName,
      source,
      pluralSource,
      dir: `${newComponentsPath}`,
    });

    return newComponentsPath;
  } catch (exception) {
    throw new Error(
      `[createClientResource.createComponents] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.name) throw new Error('options.name is required.');
  } catch (exception) {
    throw new Error(
      `[createClientResource.validateOptions] ${exception.message}`,
    );
  }
};

const createClientResource = async (options) => {
  try {
    validateOptions(options);

    console.log(options);

    const name = splitKebabTextIntoCases(options.name);
    const pluralName = splitKebabTextIntoCases(
      options.pluralName ? options.pluralName : `${options.name}s`,
    );

    const source = splitKebabTextIntoCases('red-fox');
    const pluralSource = splitKebabTextIntoCases('red-foxes');

    await createComponents({
      name,
      pluralName,
      source,
      pluralSource,
    });

    await createPages({
      name,
      pluralName,
      source,
      pluralSource,
    });
  } catch (exception) {
    throw new Error(`[createClientResource] ${exception.message}`);
  }
};

module.exports = createClientResource;
