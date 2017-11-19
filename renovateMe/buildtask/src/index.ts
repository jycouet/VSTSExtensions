import * as tl from "vsts-task-lib/task";

class ExecutionOptions {
  public tool: string;
  public arguments: string;
}

async function run(): Promise<void> {

  // vsts Task Token
  const token: string = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
  if (!token || token === '') {
    throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
  }

  const renovateOptionsVersion = tl.getInput("renovateOptionsVersion");

  const repo: string | null = process.env["BUILD_REPOSITORY_NAME"];
  if (!repo) {
    throw new Error(`Could not determine repository name. This task may not be compatible with your build system.`);
  }

  const instance: string | null = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"];
  if (!instance) {
    throw new Error(`Could not determine build server uri. This task may not be compatible with your build system.`);
  }

  // is yarn capable
  let isYarnCapable = false;
  try {
    tl.which('yarn', true);
    tl.debug('Yeahhh, yarn is installed!');
    isYarnCapable = true;
  } catch (error) {
    tl.warning(`yarn not found... don't worry we will use npm... but it will be slower...`);
  }

  // prepare to install renovate
  const renovateInstallOptions: ExecutionOptions = isYarnCapable 
    ? { tool: 'yarn', arguments: `global add renovate@${renovateOptionsVersion}` }
    : { tool: 'npm', arguments: `install -g renovate@${renovateOptionsVersion}` };

  // install renovate
  tl.debug(`Install renovate`);
  await exec(renovateInstallOptions);
  
  // prepare run renovate
  const renovateArgs: string = `${repo} --platform vsts --endpoint ${instance}DefaultCollection --token ${token}`;
  tl.debug(`renovateArgs to run: ${renovateArgs}`);

  // run renovate
  tl.debug(`Run renovate`);
  await exec({
    tool: 'renovate',
    arguments: renovateArgs
  });
  
  // the end!
  tl.debug(`Renovate done`);
}

async function exec(options: ExecutionOptions): Promise<void> {
  try {
    await tl.exec(options!.tool, options!.arguments);
  } catch (error) {
    const errorMessage: string = `exec(${options!.tool}, ${options!.arguments}): ${error}`;
    tl.error(errorMessage);
    throw new Error(errorMessage);
  }
}

run()
  .then(() =>
    tl.setResult(tl.TaskResult.Succeeded, "")
  )
  .catch((err) =>
    tl.setResult(tl.TaskResult.Failed, err)
  );
