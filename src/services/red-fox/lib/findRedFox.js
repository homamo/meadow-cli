import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import stringifyFilter from '../../../lib/stringifyFilter';

const findRedFoxOnDatabase = async ({ filter }) => {
  try {
    Logger.debug(
      `[findRedFox.findRedFoxOnDatabase] Finding a RedFox on the database that matches ${stringifyFilter(
        filter,
      )}...`,
    );

    const redFox = await RedFox.findOne(filter)
      // Consider the populate will slow the query down considerably
      .populate({
        path: 'owner',
      });

    Logger.debug('[findRedFox.findRedFoxOnDatabase] RedFox found.');
    return redFox;
  } catch (exception) {
    throw new Error(`[findRedFox.findRedFoxOnDatabase] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[findRedFox.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');

    Logger.debug('[findRedFox.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[findRedFox.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { filter } = options;
    const redFox = await findRedFoxOnDatabase({ filter });
    return redFox;
  } catch (exception) {
    throw new Error(`[findRedFox] ${exception.message}`);
  }
};
