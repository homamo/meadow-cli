import { parseAsync as parser } from 'json2csv';
import dayjs from 'dayjs';
import Logger from '../../../loaders/logger';
import findRedFoxes from './findRedFoxes';

const fields = [
  { label: 'ID', value: '_id' },
  { label: 'Name', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Owner', value: 'owner.email', default: 'Not found' },
  { label: 'Created', value: 'createdAt' },
];

const getFilename = () => {
  try {
    Logger.debug('[exportRedFoxes.getFilename] Formatting filename...');
    const timestamp = dayjs(new Date()).format('YYYYMMDD-HHmm');
    return `red-foxes-${timestamp}.csv`;
  } catch (exception) {
    throw new Error(`[exportRedFoxes.getFilename] ${exception.message}`);
  }
};

const convertCsv = async ({ data }) => {
  try {
    Logger.debug('[exportRedFoxes.convertCsv] Converting data to csv...');

    const csv = parser(data, { fields }).catch((err) => {
      throw new Error(err);
    });
    return csv;
  } catch (exception) {
    throw new Error(`[exportRedFoxes.convertCsv] ${exception.message}`);
  }
};

const buildDataOptions = ({ options }) => {
  try {
    Logger.debug('[exportRedFoxes.buildDataOptions] Building data options...');

    const dataOptions = {
      sortBy: 'createdAt',
      sortByDesc: false,
    };

    if (options) {
      if (options.status) dataOptions.status = options.status;
    }

    return dataOptions;
  } catch (exception) {
    throw new Error(`[exportRedFoxes.buildDataOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    const dataOptions = buildDataOptions({ options });
    const { data } = await findRedFoxes(dataOptions);
    const file = await convertCsv({ data });
    const filename = getFilename();
    return { file, filename };
  } catch (exception) {
    throw new Error(`[exportRedFoxes] ${exception.message}`);
  }
};
