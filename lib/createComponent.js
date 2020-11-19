/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const replace = require('replace-in-file');
const capitalize = require('./capitalize');

const inFileReplace = async ({ name, files }) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    console.log(`Replacing Rabbit with ${name} in ${files}`);

    const ComponentRegExp = new RegExp('Rabbit', 'g');

    const results = await await replace({
      files,
      from: [ComponentRegExp],
      to: [name],
    });
    console.log('Replacement results:', results);
    return results;
  } catch (exception) {
    throw new Error(`[createComponent.inFileReplace] ${exception.message}`);
  }
};

const createFiles = async ({ name }) => {
  try {
    console.log('[createComponent.createFiles] Creating files...');

    const packageDirectory = path.dirname(__dirname);
    const projectDirectory = path.dirname(process.cwd());

    console.log(`packageDirectory: ${packageDirectory}`);
    console.log(`projectDirectory: ${projectDirectory}`);

    console.log(`Creating ${name} component`);
    const newComponentPath = `${projectDirectory}/client/src/components/${name}`;
    fse.copySync(
      `${packageDirectory}/components/ComponentWithStyles`,
      newComponentPath,
    );

    return newComponentPath;
  } catch (exception) {
    throw new Error(`[createComponent.createFiles] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.name) throw new Error('options.name is required.');
  } catch (exception) {
    throw new Error(`[createComponent.validateOptions] ${exception.message}`);
  }
};

const createComponent = async (options) => {
  try {
    validateOptions(options);

    const name = capitalize(options.name);

    const newComponentPath = await createFiles({ name });

    await inFileReplace({
      name,
      files: `${newComponentPath}/**/**`,
    });
  } catch (exception) {
    throw new Error(`[createComponent] ${exception.message}`);
  }
};

module.exports = createComponent;
