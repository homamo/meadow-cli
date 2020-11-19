import { parseAsync as parser } from 'json2csv';
import dayjs from 'dayjs';
import Logger from '../../../loaders/logger';
import findRabbits from './findRabbits';

const fields = [
  { label: 'ID', value: '_id' },
  { label: 'Title', value: 'title' },
  { label: 'Status', value: 'status' },
  { label: 'Owner', value: 'owner.email', default: 'Not found' },
  { label: 'Created', value: 'createdAt' },
];

const getFilename = () => {
  try {
    Logger.debug('[exportRabbits.getFilename] Formatting filename...');
    const timestamp = dayjs(new Date()).format('YYYYMMDD-HHmm');
    return `rabbits-${timestamp}.csv`;
  } catch (exception) {
    throw new Error(`[exportRabbits.getFilename] ${exception.message}`);
  }
};

const convertCsv = async ({ data }) => {
  try {
    Logger.debug('[exportRabbits.convertCsv] Converting data to csv...');

    const csv = parser(data, { fields }).catch(err => {
      throw new Error(err);
    });
    return csv;
  } catch (exception) {
    throw new Error(`[exportRabbits.convertCsv] ${exception.message}`);
  }
};

const buildDataOptions = ({ options }) => {
  try {
    Logger.debug('[exportRabbits.buildDataOptions] Building data options...');

    const dataOptions = {
      sortBy: 'createdAt',
      sortByDesc: false,
    };

    if (options) {
      if (options.status) dataOptions.status = options.status;
    }

    return dataOptions;
  } catch (exception) {
    throw new Error(`[exportRabbits.buildDataOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    const dataOptions = buildDataOptions({ options });
    const { data } = await findRabbits(dataOptions);
    const file = await convertCsv({ data });
    const filename = getFilename();
    return { file, filename };
  } catch (exception) {
    throw new Error(`[exportRabbits] ${exception.message}`);
  }
};
