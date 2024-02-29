#! /usr/bin/env node

const projectName = process.argv[2];
const gitCloneCmd = `git clone https://github.com/hitonichi/express-ts-template.git ${projectName}`;
const npmInstallDepsCmd = `cd ${projectName} && npm i`;

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

const path = require('path');
const fs = require('fs');
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);

const installDeps = async () => {
  try {
    const rmGit = fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });
    const rmBin = fs.rmSync(path.join(projectPath, 'bin'), { recursive: true, force: true });
    await Promise.all([rmBin, rmGit]);

    const projectPackageJson = require(path.join(projectPath, 'package.json'));
    projectPackageJson.name = projectName;
    projectPackageJson.description = '';
    projectPackageJson.bin = '';

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(projectPackageJson, null, 2));

    console.log('Installing dependencies...');

    const installed = fireCmd(npmInstallDepsCmd);

    if (!installed) {
      console.error('Failed to install dependencies');
      process.exit(-1);
    }

    console.log(`Success! Created ${projectName} at ${process.cwd()}/${projectName}`);
    console.log('Inside that directory, you can run several commands:');
    console.log('  npm run start && npm run build');
  } catch (err) {
    // clean up in case of error, so the user does not have to do it manually
    fs.rmSync(projectPath, { recursive: true, force: true });
    console.log(err);
  }
};

installDeps();
