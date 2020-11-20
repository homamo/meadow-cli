/* eslint-disable no-useless-escape */
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

const registerRoutes = async ({ name, pluralName }) => {
  try {
    console.log(`Registering ${name.kebab} routes`);

    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    const importPlaceholder = `// MEADOW: Import`;
    const importRegExp = new RegExp(RegExp.escape(importPlaceholder), 'g');

    const registerPlaceholder = `{/* MEADOW: Register */}`;
    const registerRegExp = new RegExp(RegExp.escape(registerPlaceholder), 'g');

    const results = await replace({
      files: `${projectDirectory}/client/src/Routes.jsx`,
      from: [importRegExp, registerRegExp],
      to: [
        `
import ${name.pascal} from "./pages/${name.kebab}/${name.kebab}";
import ${pluralName.pascal} from "./pages/${name.kebab}/${pluralName.kebab}";
import Create${name.pascal} from "./pages/${name.kebab}/create-${name.kebab}";
import Edit${name.pascal} from "./pages/${name.kebab}/edit-${name.kebab}";
${importPlaceholder}`,
        `
        <PrivateRoute path="/${pluralName.kebab}" exact component={() => <${pluralName.pascal} />} />
        <PrivateRoute
          path="/create-${name.kebab}"
          exact
          component={() => <Create${name.pascal} />}
        />
        <PrivateRoute path="/${name.kebab}/:id" exact component={() => <${name.pascal} />} />
        <PrivateRoute
          path="/${name.kebab}/:id/edit"
          exact
          component={() => <Edit${name.pascal} />}
        />
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

    await registerRoutes({ name, pluralName });
  } catch (exception) {
    throw new Error(`[createClientResource] ${exception.message}`);
  }
};

module.exports = createClientResource;
