import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import countRabbits from './countRabbits';
import stringifyFilter from '../../../lib/stringifyFilter';

const buildResponseObject = ({
  rabbits,
  totalRabbitsCount,
  pageIndex,
  searchTerm,
}) => {
  try {
    Logger.debug(
      '[findRabbits.buildResponseObject] Building response object...',
    );

    const responseObject = {
      data: rabbits,
      totalCount: totalRabbitsCount,
      pageIndex: !searchTerm ? pageIndex : 0,
    };

    Logger.debug('[findRabbits.buildResponseObject] Response object built.');
    return responseObject;
  } catch (exception) {
    throw new Error(`[findRabbits.buildResponseObject] ${exception.message}`);
  }
};

const findRabbitsOnDatabase = async ({ filter, sort, pageSize, pageIndex }) => {
  try {
    Logger.debug(
      `[findRabbits.findRabbitsOnDatabase] Finding rabbits on the database that match ${stringifyFilter(
        filter,
      )}...`,
    );

    const rabbits = await Rabbit.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      // Consider the populate will slow the query down considerably
      .populate({
        path: 'owner',
      });

    Logger.debug('[findRabbits.findRabbitsOnDatabase] Rabbits found.');
    return rabbits;
  } catch (exception) {
    throw new Error(`[findRabbits.findRabbitsOnDatabase] ${exception.message}`);
  }
};

const buildSortObject = ({ sortBy, sortByDesc }) => {
  try {
    Logger.debug('[findRabbits.buildSortObject] Building sort object...');

    const sort = {};
    if (sortBy) sort[sortBy] = sortByDesc ? -1 : 1;

    Logger.debug('[findRabbits.buildSortObject] Sort object built.');
    return sort;
  } catch (exception) {
    throw new Error(`[findRabbits.buildSortObject] ${exception.message}`);
  }
};

const buildFilterObject = ({ searchTerm, status }) => {
  try {
    Logger.debug('[findRabbits.buildFilterObject] Building filter object...');

    const partialSearch = true;
    const filter = {};

    if (status !== undefined) filter.status = status;

    if (searchTerm) {
      if (partialSearch) {
        RegExp.escape = string =>
          string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

        const search = new RegExp(RegExp.escape(searchTerm));
        filter.title = { $regex: search, $options: 'i' };
      } else {
        // Requires a text index on the collection
        filter.$text = {
          $search: searchTerm,
        };
      }
    }

    Logger.debug('[findRabbits.buildFilterObject] Filter object built.');
    return filter;
  } catch (exception) {
    throw new Error(`[findRabbits.buildFilterObject] ${exception.message}`);
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[findRabbits.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');

    Logger.debug('[findRabbits.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[findRabbits.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const {
      searchTerm,
      pageSize,
      pageIndex,
      sortBy,
      sortByDesc,
      status,
    } = options;

    const filter = buildFilterObject({
      searchTerm,
      status,
      sortBy,
      sortByDesc,
    });

    const sort = buildSortObject({ sortBy, sortByDesc });

    const rabbits = await findRabbitsOnDatabase({
      filter,
      sort,
      pageSize,
      pageIndex,
    });

    const totalRabbitsCount = await countRabbits({ filter });

    const responseObject = await buildResponseObject({
      rabbits,
      totalRabbitsCount,
      pageIndex,
      searchTerm,
    });

    return responseObject;
  } catch (exception) {
    throw new Error(`[findRabbits] ${exception.message}`);
  }
};
