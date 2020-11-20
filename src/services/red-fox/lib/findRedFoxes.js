import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import countRedFoxes from './countRedFoxes';
import stringifyFilter from '../../../lib/stringifyFilter';

const buildResponseObject = ({
  redFoxes,
  totalRedFoxesCount,
  pageIndex,
  searchTerm,
}) => {
  try {
    Logger.debug(
      '[findRedFoxes.buildResponseObject] Building response object...',
    );

    const responseObject = {
      data: redFoxes,
      totalCount: totalRedFoxesCount,
      pageIndex: !searchTerm ? pageIndex : 0,
    };

    Logger.debug('[findRedFoxes.buildResponseObject] Response object built.');
    return responseObject;
  } catch (exception) {
    throw new Error(`[findRedFoxes.buildResponseObject] ${exception.message}`);
  }
};

const findRedFoxesOnDatabase = async ({
  filter,
  sort,
  pageSize,
  pageIndex,
}) => {
  try {
    Logger.debug(
      `[findRedFoxes.findRedFoxesOnDatabase] Finding RedFoxes on the database that match ${stringifyFilter(
        filter,
      )}...`,
    );

    const redFoxes = await RedFox.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * pageIndex)
      // Consider the populate will slow the query down considerably
      .populate({
        path: 'owner',
      });

    Logger.debug('[findRedFoxes.findRedFoxesOnDatabase] RedFoxes found.');
    return redFoxes;
  } catch (exception) {
    throw new Error(
      `[findRedFoxes.findRedFoxesOnDatabase] ${exception.message}`,
    );
  }
};

const buildSortObject = ({ sortBy, sortByDesc }) => {
  try {
    Logger.debug('[findRedFoxes.buildSortObject] Building sort object...');

    const sort = {};
    if (sortBy) sort[sortBy] = sortByDesc ? -1 : 1;

    Logger.debug('[findRedFoxes.buildSortObject] Sort object built.');
    return sort;
  } catch (exception) {
    throw new Error(`[findRedFoxes.buildSortObject] ${exception.message}`);
  }
};

const buildFilterObject = ({ searchTerm, status }) => {
  try {
    Logger.debug('[findRedFoxes.buildFilterObject] Building filter object...');

    const partialSearch = true;
    const filter = {};

    if (status !== undefined) filter.status = status;

    if (searchTerm) {
      if (partialSearch) {
        RegExp.escape = (string) =>
          string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

        const search = new RegExp(RegExp.escape(searchTerm));
        filter.name = { $regex: search, $options: 'i' };
      } else {
        // Requires a text index on the collection
        filter.$text = {
          $search: searchTerm,
        };
      }
    }

    Logger.debug('[findRedFoxes.buildFilterObject] Filter object built.');
    return filter;
  } catch (exception) {
    throw new Error(`[findRedFoxes.buildFilterObject] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[findRedFoxes.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');

    Logger.debug('[findRedFoxes.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[findRedFoxes.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
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

    const redFoxes = await findRedFoxesOnDatabase({
      filter,
      sort,
      pageSize,
      pageIndex,
    });

    const totalRedFoxesCount = await countRedFoxes({ filter });

    const responseObject = await buildResponseObject({
      redFoxes,
      totalRedFoxesCount,
      pageIndex,
      searchTerm,
    });

    return responseObject;
  } catch (exception) {
    throw new Error(`[findRedFoxes] ${exception.message}`);
  }
};
