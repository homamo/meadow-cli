#! /usr/bin/env node
/* eslint-disable no-console */
const createServerResource = require('../lib/createServerResource');

const name = process.argv[2];
const pluralName = process.argv[3];

if (pluralName) {
  console.log(
    `Running Create Server Resource with '${name}' and ${pluralName}`,
  );
} else {
  console.log(`Running Create Server Resource with '${name}'`);
}

createServerResource({ name, pluralName });
