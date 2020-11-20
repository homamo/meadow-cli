/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');

const replaceTextCases = require('./replaceTextCases');

const renameFileNames = async ({
  name,
  pluralName,
  source,
  pluralSource,
  dir,
}) => {
  try {
    RegExp.escape = (string) => {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    let files;

    // eslint-disable-next-line no-restricted-syntax
    for (const textCase of replaceTextCases) {
      console.log(`Renaming ${textCase} text in file names`);

      const sourceMatch = RegExp(RegExp.escape(source[textCase]), 'g');
      const pluralSourceMatch = RegExp(
        RegExp.escape(pluralSource[textCase]),
        'g',
      );

      // Re-read as some files are renamed
      files = fse.readdirSync(dir);

      files
        .filter((file) => file.match(pluralSourceMatch))
        .forEach((file) => {
          if (file) {
            const filePath = path.join(dir, file);
            const newFilePath = path.join(
              dir,
              file.replace(pluralSourceMatch, pluralName[textCase]),
            );

            fse.renameSync(filePath, newFilePath);
          }
        });

      // Re-read as some files are renamed
      files = fse.readdirSync(dir);

      files
        .filter((file) => file.match(sourceMatch))
        .forEach((file) => {
          if (file) {
            const filePath = path.join(dir, file);
            const newFilePath = path.join(
              dir,
              file.replace(sourceMatch, name[textCase]),
            );

            fse.renameSync(filePath, newFilePath);
          }
        });
    }

    return files.length;
  } catch (exception) {
    throw new Error(`[renameFileNames] ${exception.message}`);
  }
};

module.exports = renameFileNames;
