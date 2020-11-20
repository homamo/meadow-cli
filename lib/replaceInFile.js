/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const replace = require('replace-in-file');

const replaceTextCases = require('./replaceTextCases');

const replaceInFile = async ({
  name,
  pluralName,
  source,
  pluralSource,
  files,
}) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    console.log(
      `Replacing ${source.kebab} with ${name.kebab} in ${files} files`,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const textCase of replaceTextCases) {
      console.log(`Replacing ${textCase} text in file`);

      const sourceMatch = RegExp(RegExp.escape(source[textCase]), 'g');
      const pluralSourceMatch = RegExp(
        RegExp.escape(pluralSource[textCase]),
        'g',
      );

      const results = await replace({
        files,
        from: [pluralSourceMatch, sourceMatch],
        to: [pluralName[textCase], name[textCase]],
      });
      console.log(`Replacement ${textCase} results:`, results);
    }
  } catch (exception) {
    throw new Error(`[replaceInFile] ${exception.message}`);
  }
};

module.exports = replaceInFile;
