import * as taskLib from "azure-pipelines-task-lib/task";
import { IExecSyncResult } from "azure-pipelines-task-lib/toolrunner";

interface ExecutionOptions {
  tool: string;
  arguments: string;
}

async function run(): Promise<void> {

  // vsts Source Code Provider
  const sourceCodeProvider: string = process.env["BUILD_REPOSITORY_PROVIDER"] || '';
  if (sourceCodeProvider !== 'TfsGit') {
    throw new Error(`Sorry, we support only TfsGit for now. Please post an issue if you need more :)`);
  }

  // vsts Task Token
  const token: string | undefined = process.env["RENOVATE_TOKEN"] || taskLib.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
  if (!token || token === '') {
    throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
  }

  const renovateOptionsVersion = taskLib.getInput("renovateOptionsVersion") || 'latest';
  const renovateOptionsArgs = taskLib.getInput("renovateOptionsArgs") || '';

  const project: string | undefined = process.env["SYSTEM_TEAMPROJECT"];
  if (!project) {
    throw new Error(`Could not determine project name. This task may not be compatible with your build system.`);
  }

  const repo: string | undefined = process.env["BUILD_REPOSITORY_NAME"];
  if (!repo) {
    throw new Error(`Could not determine repository name. This task may not be compatible with your build system.`);
  }

  const endpointAndCollection: string | undefined = process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"];
  if (!endpointAndCollection) {
    throw new Error(`Could not determine build server uri. This task may not be compatible with your build system.`);
  }

  // is yarn capable
  let isYarnCapable = false;
  let yarnGlobalPath: string = '';
  try {
    taskLib.which('yarn', true);
    taskLib.debug('Yeahhh, yarn is installed!');
    isYarnCapable = true;
    yarnGlobalPath = (await taskLib.execSync('yarn', 'global bin')).stdout.trim();
  } catch (error) {
    taskLib.warning(`yarn not found... don't worry we will use npm... but it will be slower...`);
  }

  // prepare to install renovate
  const renovateInstallCmd: ExecutionOptions = isYarnCapable
    ? { tool: 'yarn', arguments: `global add renovate@${renovateOptionsVersion}` }
    : { tool: 'npm', arguments: `install -g renovate@${renovateOptionsVersion}` };

  // install renovate
  taskLib.debug(`Install renovate`);
  await exec(renovateInstallCmd);

  // prepare run renovate
  const renovateArgs: string = `\"${project}\"/\"${repo}\" --platform azure --endpoint ${endpointAndCollection} --token ${token} ${renovateOptionsArgs}`;
  taskLib.debug(`renovateArgs to run: ${renovateArgs}`);
  const runRenovateCmd: ExecutionOptions = isYarnCapable
    ? { tool: yarnGlobalPath + '\\renovate', arguments: `${renovateArgs}` }
    : { tool: 'renovate', arguments: `${renovateArgs}` };

  // run renovate
  taskLib.debug(`Run renovate`);
  //await exec({ tool: 'npx', arguments: `renovate@${renovateOptionsVersion} ${renovateArgs}` });
  // await exec({ tool: 'renovate', arguments: `${renovateArgs}` });
  await exec(runRenovateCmd);

  // the end!
  taskLib.debug(`Renovate done`);
}

async function exec(options: ExecutionOptions): Promise<void> {
  try {    
    await taskLib.exec(options!.tool, options!.arguments);
  } catch (error) {
    const errorMessage: string = `exec(${options!.tool}, ${options!.arguments}): ${error}`;
    taskLib.error(errorMessage);
    throw new Error(errorMessage);
  }
}

run()
  .then(() =>
    taskLib.setResult(taskLib.TaskResult.Succeeded, "")
  )
  .catch((err) =>
    taskLib.setResult(taskLib.TaskResult.Failed, err)
  );
