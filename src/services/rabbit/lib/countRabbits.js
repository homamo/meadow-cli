import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import stringifyFilter from '../../../lib/stringifyFilter';

const countRabbitsOnDatabase = async ({ filter, estimated }) => {
  try {
    if (estimated)
      Logger.debug(
        `[countRabbits.countRabbitsOnDatabase] Quick count enabled.`,
      );
    Logger.debug(
      `[countRabbits.countRabbitsOnDatabase] Counting rabbits on database that match ${stringifyFilter(
        filter,
      )}...`,
    );

    const rabbitCount = estimated
      ? await Rabbit.estimatedDocumentCount(filter).catch((e) => {
          throw new Error(e);
        })
      : await Rabbit.countDocuments(filter).catch((e) => {
          throw new Error(e);
        });

    Logger.debug(
      `[countRabbits.countRabbitsOnDatabase] ${rabbitCount} matching rabbits counted on database.`,
    );
    return rabbitCount;
  } catch (exception) {
    throw new Error(
      `[countRabbits.countRabbitsOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[countRabbits.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');

    Logger.debug('[countRabbits.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[countRabbits.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { filter, estimated } = options;
    const rabbitCount = await countRabbitsOnDatabase({ filter, estimated });
    return rabbitCount;
  } catch (exception) {
    throw new Error(`[countRabbits] ${exception.message}`);
  }
};
