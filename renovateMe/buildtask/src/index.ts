import * as tl from "vsts-task-lib/task";
import * as taskLib from 'vsts-task-lib/task';

async function run() {

  // vsts Task Token
  let token: string = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
  if (!token || token === '') {
    throw Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
  }

  const renovateOptionsVersion = tl.getInput("renovateOptionsVersion");
  const repo = process.env["BUILD_REPOSITORY_NAME"];
  const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"]

  // is yarn capable
  let isYarnCapable = false;
  try {
    tl.which('yarn', true);
    tl.debug('Yeahhh, yarn is installed!')
    isYarnCapable = true;
  } catch (error) {
    tl.warning(`yarn not found... don't worry we will use npm... but it will be slower...`)
  }

  // prepare install renovate
  const tool = isYarnCapable ? 'yarn' : 'npm';
  const args = isYarnCapable ? 'global add renovate@' + renovateOptionsVersion : 'install -g renovate@' + renovateOptionsVersion;

  // install renovate
  tl.debug(`Install renovate`);
  await exec(tool, args);
  
  // prepare run renovate
  const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection --token ${token}`;
  tl.debug(`renovateArgs to run: ${renovateArgs}`);

  // run renovate
  tl.debug(`Run renovate`);
  await exec('renovate', renovateArgs);
  
  // the end!
  tl.debug(`Renovate done`);
}

async function exec(tool: string, args: string) {
  await tl.exec(tool, args)
    .catch(err => {
      tl.error(`exec(${tool}, ${args}): ${err}`);
      throw Error(`exec(${tool}, ${args}): ${err}`);
    })
    .then()
}

run()
  .then(() =>
    taskLib.setResult(taskLib.TaskResult.Succeeded, "")
  )
  .catch((err) =>
    taskLib.setResult(taskLib.TaskResult.Failed, err)
  );;