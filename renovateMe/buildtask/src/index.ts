import * as tl from "vsts-task-lib/task";

async function run() {

  // set VSTS_TOKEN
  process.env["VSTS_TOKEN"] = tl.getInput("personalAccessToken");
  const repo = process.env["BUILD_REPOSITORY_NAME"];
  const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"]
  
  // is yarn capable
  let isYarnCapable = false;
  try {
    tl.which('yarn', true);
    tl.debug('Yeahhh, yarn is installed!')
    isYarnCapable = true;
  } catch (error) {
    tl.warning(`yarn not found... don't worry we will use npm... but it will be slow...`)
  }
  
  // prepare install renovate
  const tool = isYarnCapable ? 'yarn' : 'npm';
  const args = isYarnCapable ? 'global add renovate' : 'install renovate -g';

  // install renovate
  tl.debug(`Install renovate`);
  await exec(tool, args);

  // prepare run renovate
  const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection`;
  tl.debug(`renovateArgs to run: ${renovateArgs}`);
  
  // run renovate
  tl.debug(`Run renovate`);
  await exec('renovate', renovateArgs);

  // the end!
  tl.debug(`Renovate done`);
}

async function exec(tool: string, args: string) {
  let result = 0;
  await tl.exec(tool, args)
    .catch(err => {
      tl.error(`exec(${tool}, ${args}): ${err}`);
      result = 0;
    })
    .then(c => {
      result = 1;
    });
    return result;
}

run();