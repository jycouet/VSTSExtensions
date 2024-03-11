import * as taskLib from 'azure-pipelines-task-lib/task';
var stream = require('stream');
interface ExecutionOptions {
  tool: string;
  arguments: string;
}

async function run(): Promise<void> {
  // vsts Source Code Provider
  const sourceCodeProvider: string =
    process.env['BUILD_REPOSITORY_PROVIDER'] || '';
  if (sourceCodeProvider !== 'TfsGit') {
    throw new Error(
      `Sorry, we support only TfsGit for now. Please post an issue if you need more :)`
    );
  }

  // vsts Task Token
  const token: string | undefined =
    process.env['RENOVATE_TOKEN'] ||
    taskLib.getEndpointAuthorizationParameter(
      'SYSTEMVSSCONNECTION',
      'ACCESSTOKEN',
      false
    );
  if (!token || token === '') {
    throw new Error(
      `You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`
    );
  }

  const renovateOptionsVersion =
    taskLib.getInput('renovateOptionsVersion') || 'latest';
  const renovateOptionsArgs = taskLib.getInput('renovateOptionsArgs') || '';

  const project: string | undefined = process.env['SYSTEM_TEAMPROJECT'];
  if (!project) {
    throw new Error(
      `Could not determine project name. This task may not be compatible with your build system.`
    );
  }

  const repo: string | undefined = process.env['BUILD_REPOSITORY_NAME'];
  if (!repo) {
    throw new Error(
      `Could not determine repository name. This task may not be compatible with your build system.`
    );
  }

  const endpointAndCollection: string | undefined =
    process.env['SYSTEM_TEAMFOUNDATIONCOLLECTIONURI'];
  if (!endpointAndCollection) {
    throw new Error(
      `Could not determine build server uri. This task may not be compatible with your build system.`
    );
  }

  // validate renovate config so that pipeline will fail if config errors are present.
  taskLib.debug(`Validating renovate config`);
  await exec({
    tool: 'npx',
    arguments: `--yes --package renovate@${renovateOptionsVersion} -- renovate-config-validator`,
  });

  // prepare run renovate
  const renovateArgs: string = `\"${project}\"/\"${repo}\" --platform azure --endpoint ${endpointAndCollection} --token ${token} ${renovateOptionsArgs}`;
  taskLib.debug(`renovateArgs to run: ${renovateArgs}`);

  // run renovate
  taskLib.debug(`Run renovate`);
  await exec({
    tool: 'npx',
    arguments: `renovate@${renovateOptionsVersion} ${renovateArgs}`,
  });

  // the end!
  taskLib.debug(`Renovate done`);
}

let needToRun = true;

async function exec(options: ExecutionOptions): Promise<void> {
  try {
    let i = 1;
    while (needToRun && i <= 10) {
      taskLib.debug(`Renovate run n° ${i}`);
      needToRun = false;
      await taskLib.exec(options!.tool, options!.arguments, {
        outStream: readOutStream,
      });
      i++;
    }
  } catch (error) {
    const errorMessage: string = `exec(${options!.tool}, ${
      options!.arguments
    }): ${error}`;
    taskLib.error(errorMessage);
    throw new Error(errorMessage);
  }
}

var readOutStream = new stream.Writable({
  write: function (chunk: any, encoding: any, next: any) {
    const str = chunk.toString();
    if (str.includes('INFO: PR automerged')) {
      needToRun = true;
    }
    console.log(str);
    next();
  },
});

run()
  .then(() => taskLib.setResult(taskLib.TaskResult.Succeeded, ''))
  .catch((err) => taskLib.setResult(taskLib.TaskResult.Failed, err));
