#! /usr/bin/env node
const createServerResource = require('../lib/createServerResource');

const name = process.argv[2];

console.log(`Running Create Server Resource with '${name}'`);

createServerResource({ name });
