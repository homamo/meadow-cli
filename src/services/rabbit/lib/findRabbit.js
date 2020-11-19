import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import stringifyFilter from '../../../lib/stringifyFilter';

const findRabbitOnDatabase = async ({ filter }) => {
  try {
    Logger.debug(
      `[findRabbit.findRabbitOnDatabase] Finding a rabbit on the database that matches ${stringifyFilter(
        filter,
      )}...`,
    );

    const rabbit = await Rabbit.findOne(filter)
      // Consider the populate will slow the query down considerably
      .populate({
        path: 'owner',
      });

    Logger.debug('[findRabbit.findRabbitOnDatabase] Rabbit found.');
    return rabbit;
  } catch (exception) {
    throw new Error(`[findRabbit.findRabbitOnDatabase] ${exception.message}`);
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[findRabbit.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.filter) throw new Error('options.filter is required.');

    Logger.debug('[findRabbit.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[findRabbit.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const { filter } = options;
    const rabbit = await findRabbitOnDatabase({ filter });
    return rabbit;
  } catch (exception) {
    throw new Error(`[findRabbit] ${exception.message}`);
  }
};
