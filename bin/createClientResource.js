#! /usr/bin/env node
/* eslint-disable no-console */
const createClientResource = require('../lib/createClientResource');

const name = process.argv[2];
const dashName = process.argv[3];

if (dashName) {
  console.log(`Running Create Client Resource with '${name}' and ${dashName}`);
} else {
  console.log(`Running Create Client Resource with '${name}'`);
}

createClientResource({ name, dashName });
