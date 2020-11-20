import Logger from '../../../loaders/logger';
import RedFox from '../../../models/RedFox';
import stringifyFilter from '../../../lib/stringifyFilter';

const deleteRedFoxesOnDatabase = async ({ filter }) => {
  try {
    Logger.debug(
      `[deleteRedFoxes.deleteRedFoxesOnDatabase] Deleting RedFoxes matching ${stringifyFilter(
        filter,
      )}...`,
    );

    await RedFox.deleteMany(filter).catch((e) => {
      throw new Error(e);
    });
  } catch (exception) {
    throw new Error(
      `[deleteRedFoxes.deleteRedFoxesOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[deleteRedFoxes.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');
    if (options.filter === {})
      throw new Error('options.filter cannot be empty');

    Logger.debug('[deleteRedFoxes.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[deleteRedFoxes.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { filter } = options;
    await deleteRedFoxesOnDatabase({ filter });
  } catch (exception) {
    throw new Error(`[deleteRedFoxes] ${exception.message}`);
  }
};
