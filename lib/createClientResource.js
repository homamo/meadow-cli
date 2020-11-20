/* eslint-disable no-useless-escape */
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
  dashName,
  source,
  dashSource,
  pluralName,
  pluralSource,
  pluralDashName,
  pluralDashSource,
  files,
}) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    console.log(`Replacing ${source} with ${name} in ${files}`);
    const dashPluralSourceRegExp = new RegExp(
      RegExp.escape(pluralDashSource),
      'g',
    );
    const lowerPluralSourceRegExp = new RegExp(pluralSource, 'g');
    const capPluralSourceRegExp = new RegExp(capitalize(pluralSource), 'g');

    const dashSourceRegExp = new RegExp(RegExp.escape(dashSource), 'g');
    const lowerSourceRegExp = new RegExp(source, 'g');
    const capSourceRegExp = new RegExp(capitalize(source), 'g');

    const results = await await replace({
      files,
      from: [
        dashPluralSourceRegExp,
        dashSourceRegExp,
        lowerPluralSourceRegExp,
        capPluralSourceRegExp,
        lowerSourceRegExp,
        capSourceRegExp,
      ],
      to: [
        pluralDashName,
        dashName,
        pluralName,
        capitalize(pluralName),
        name,
        capitalize(name),
      ],
    });
    console.log('Replacement results:', results);
    return results;
  } catch (exception) {
    throw new Error(
      `[createClientResource.inFileReplace] ${exception.message}`,
    );
  }
};

const renameFileNames = async ({
  name,
  dashName,
  source,
  dashSource,
  pluralName,
  pluralSource,
  pluralDashName,
  pluralDashSource,
  dir,
}) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    let files = fse.readdirSync(dir);
    const pluralMatch = RegExp(pluralSource, 'g');
    const match = RegExp(source, 'g');
    const dashMatch = RegExp(RegExp.escape(dashSource), 'g');
    const pluralDashMatch = RegExp(RegExp.escape(pluralDashSource), 'g');

    files
      .filter((file) => file.match(pluralDashMatch))
      .forEach((file) => {
        if (file) {
          const filePath = path.join(dir, file);
          const newFilePath = path.join(
            dir,
            file.replace(pluralDashMatch, pluralDashName),
          );

          fse.renameSync(filePath, newFilePath);
        }
      });

    // Re-read as some files are renamed
    files = fse.readdirSync(dir);

    files
      .filter((file) => file.match(dashMatch))
      .forEach((file) => {
        if (file) {
          const filePath = path.join(dir, file);
          const newFilePath = path.join(dir, file.replace(dashMatch, dashName));

          fse.renameSync(filePath, newFilePath);
        }
      });

    // Re-read as some files are renamed
    files = fse.readdirSync(dir);

    files
      .filter((file) => file.match(pluralMatch))
      .forEach((file) => {
        if (file) {
          const filePath = path.join(dir, file);
          const newFilePath = path.join(
            dir,
            file.replace(pluralMatch, pluralName),
          );

          fse.renameSync(filePath, newFilePath);
        }
      });

    // Re-read as some files are renamed
    files = fse.readdirSync(dir);

    files
      .filter((file) => file.match(match))
      .forEach((file) => {
        if (file) {
          const filePath = path.join(dir, file);
          const newFilePath = path.join(dir, file.replace(match, name));

          fse.renameSync(filePath, newFilePath);
        }
      });
    return files.length;
  } catch (exception) {
    throw new Error(
      `[createClientResource.renameFileNames] ${exception.message}`,
    );
  }
};

const createPages = async ({
  name,
  dashName,
  source,
  dashSource,
  pluralName,
  pluralSource,
  pluralDashName,
  pluralDashSource,
}) => {
  try {
    console.log(`Creating ${capitalize(name)} pages`);
    const newPagesPath = `${projectDirectory}/client/src/pages/${dashName}`;
    fse.copySync(`${packageDirectory}/src/pages/${source}`, newPagesPath);
    console.log(`Created ${name} pages`);
    await inFileReplace({
      name,
      source,
      pluralName,
      pluralSource,
      dashName,
      dashSource,
      pluralDashName,
      pluralDashSource,
      files: `${newPagesPath}/**/**`,
    });
    await renameFileNames({
      name,
      source,
      pluralName,
      pluralSource,
      dashName,
      dashSource,
      pluralDashName,
      pluralDashSource,
      dir: `${newPagesPath}`,
    });

    return newPagesPath;
  } catch (exception) {
    throw new Error(`[createClientResource.createPages] ${exception.message}`);
  }
};

const createComponents = async ({
  name,
  dashName,
  source,
  dashSource,
  pluralName,
  pluralSource,
  pluralDashName,
  pluralDashSource,
}) => {
  try {
    console.log(`Creating ${capitalize(name)} components`);
    const newComponentsPath = `${projectDirectory}/client/src/components/${dashName}`;
    fse.copySync(
      `${packageDirectory}/src/components/${source}`,
      newComponentsPath,
    );
    console.log(`Created ${name} components`);
    await inFileReplace({
      name,
      source,
      pluralName,
      pluralSource,
      dashName,
      dashSource,
      pluralDashName,
      pluralDashSource,
      files: `${newComponentsPath}/**/**`,
    });
    await renameFileNames({
      name,
      source,
      pluralName,
      pluralSource,
      dashName,
      dashSource,
      pluralDashName,
      pluralDashSource,
      dir: `${newComponentsPath}`,
    });
    await renameFileNames({
      name: capitalize(name),
      source: capitalize(source),
      pluralName: capitalize(pluralName),
      pluralSource: capitalize(pluralSource),
      dashName,
      dashSource,
      pluralDashName,
      pluralDashSource,
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

    const { name } = options;

    const dashName = options.dashName || name;
    const pluralName = pluralize(name);
    const pluralDashName = pluralize(dashName);

    const source = 'red-fox';
    const pluralSource = pluralize(source);
    const pluralDashSource = pluralize(dashSource);

    console.log(
      name,
      dashName,
      pluralName,
      pluralDashName,
      source,
      dashSource,
      pluralSource,
      pluralDashSource,
    );

    await createComponents({
      name,
      dashName,
      source,
      dashSource,
      pluralName,
      pluralSource,
      pluralDashName,
      pluralDashSource,
    });
    await createPages({
      name,
      dashName,
      source,
      dashSource,
      pluralName,
      pluralSource,
      pluralDashName,
      pluralDashSource,
    });
  } catch (exception) {
    throw new Error(`[createClientResource] ${exception.message}`);
  }
};

module.exports = createClientResource;
