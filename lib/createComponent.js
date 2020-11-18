/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const fse = require('fs-extra');
const replace = require('replace-in-file');

function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const inFileReplace = async ({ name, files }) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    console.log(`Replacing Component with ${name} in ${files}`);

    const ComponentRegExp = new RegExp('Component', 'g');

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

    const root = path.resolve(process.cwd());

    console.log(`Creating ${name} component`);
    const newComponentPath = `${root}/src/components/${name}`;
    fse.copySync(
      `${root}/node_modules/@homamo/meadow-scripts/components/ComponentWithStyles`,
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

const createComponent = async () => {
  try {
    validateOptions(argv);

    const name = capitalize(argv.name);

    const newComponentPath = await createFiles({ name });

    await inFileReplace({
      name,
      files: `${newComponentPath}/**/**`,
    });
  } catch (exception) {
    throw new Error(`[createComponent] ${exception.message}`);
  }
};

export default createComponent();
