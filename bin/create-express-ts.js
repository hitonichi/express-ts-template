#! /usr/bin/env node

const dirName = process.argv[2];
const gitCloneCmd = `git clone https://github.com/hitonichi/express-ts-template.git ${dirName}`;
const npmInstallDepsCmd = `cd ${dirName} && npm i`;

const { execSync } = require('child_process');

const fireCmd = (cmd) => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to execute ${cmd}`, err);
    return false;
  }
  return true;
};

const checkedOut = fireCmd(gitCloneCmd);

if (!checkedOut) {
  console.error('Failed to check out the repo');
  process.exit(-1);
}

console.log('Installing dependencies...');

const installed = fireCmd(npmInstallDepsCmd);

if (!installed) {
  console.error('Failed to install dependencies');
  process.exit(-1);
}

console.log(`Success! Created ${dirName} at ${process.cwd()}/${dirName}`);
console.log('Inside that directory, you can run several commands:');
console.log('  npm run start && npm run build');
