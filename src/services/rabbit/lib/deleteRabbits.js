import Logger from '../../../loaders/logger';
import Rabbit from '../../../models/Rabbit';
import stringifyFilter from '../../../lib/stringifyFilter';

const deleteRabbitsOnDatabase = async ({ filter }) => {
  try {
    Logger.debug(
      `[deleteRabbits.deleteRabbitsOnDatabase] Deleting rabbits matching ${stringifyFilter(
        filter,
      )}...`,
    );

    await Rabbit.deleteMany(filter).catch(e => {
      throw new Error(e);
    });
  } catch (exception) {
    throw new Error(
      `[deleteRabbits.deleteRabbitsOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[deleteRabbits.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');
    if (options.filter === {})
      throw new Error('options.filter cannot be empty');

    Logger.debug('[deleteRabbits.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[deleteRabbits.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const { filter } = options;
    await deleteRabbitsOnDatabase({ filter });
  } catch (exception) {
    throw new Error(`[deleteRabbits] ${exception.message}`);
  }
};
