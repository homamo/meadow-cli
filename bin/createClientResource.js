#! /usr/bin/env node
/* eslint-disable no-console */
const createClientResource = require('../lib/createClientResource');

const name = process.argv[2];
const pluralName = process.argv[3];

if (pluralName) {
  console.log(
    `Running Create Client Resource with '${name}' and ${pluralName}`,
  );
} else {
  console.log(`Running Create Client Resource with '${name}'`);
}

createClientResource({ name, pluralName });
