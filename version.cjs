#!/usr/bin/env node
const argv = require('node:process').argv;
const inspect = require('node:util').inspect;
const write = require('node:fs').writeFileSync;
const nestjsSlack = require('./packages/nestjs-slack/package.json');
const nestjsSlackAssistant = require('./packages/nestjs-slack-assistant/package.json');

const version = argv[2];

if (!version) {
  throw new Error('version argument is required');
}

nestjsSlack.version = version;
nestjsSlackAssistant.version = version;
nestjsSlackAssistant.dependencies['@xpr/nestjs-slack'] = version;


write('./packages/nestjs-slack/package.json', inspect(nestjsSlack), 'utf8');
write('./packages/nestjs-slack-assistant/package.json', inspect(nestjsSlackAssistant), 'utf8');