import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import stringifyFilter from '../../../lib/stringifyFilter';

const countRedFoxesOnDatabase = async ({ filter, estimated }) => {
  try {
    if (estimated)
      Logger.debug(
        `[countRedFoxes.countRedFoxesOnDatabase] Quick count enabled.`,
      );
    Logger.debug(
      `[countRedFoxes.countRedFoxesOnDatabase] Counting RedFoxes on database that match ${stringifyFilter(
        filter,
      )}...`,
    );

    const redFoxCount = estimated
      ? await RedFox.estimatedDocumentCount(filter).catch((e) => {
          throw new Error(e);
        })
      : await RedFox.countDocuments(filter).catch((e) => {
          throw new Error(e);
        });

    Logger.debug(
      `[countRedFoxes.countRedFoxesOnDatabase] ${redFoxCount} matching RedFoxes counted on database.`,
    );
    return redFoxCount;
  } catch (exception) {
    throw new Error(
      `[countRedFoxes.countRedFoxesOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[countRedFoxes.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');

    Logger.debug('[countRedFoxes.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[countRedFoxes.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { filter, estimated } = options;
    const redFoxCount = await countRedFoxesOnDatabase({ filter, estimated });
    return redFoxCount;
  } catch (exception) {
    throw new Error(`[countRedFoxes] ${exception.message}`);
  }
};
