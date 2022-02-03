import * as taskLib from "azure-pipelines-task-lib";

class ExecutionOptions {
  public tool = "";
  public arguments = "";
}

async function run(): Promise<void> {
  const aesOptionsAction =
    taskLib.getInput("aesOptionsAction") === "publish"
      ? "schema:publish"
      : "schema:check";
  const aesOptionsKey = taskLib.getInput("aesOptionsKey");
  const aesOptionsEndpoint = taskLib.getInput("aesOptionsEndpoint");

  // is yarn capable
  let isYarnCapable = false;
  try {
    taskLib.which("yarn", true);
    taskLib.debug("Yeahhh, yarn is installed!");
    isYarnCapable = true;
  } catch (error) {
    taskLib.warning(
      `yarn not found... don't worry we will use npm... but it will be slower...`
    );
  }

  // prepare to install apollo
  const renovateInstallOptions: ExecutionOptions = isYarnCapable
    ? { tool: "yarn", arguments: `global add apollo` }
    : { tool: "npm", arguments: `install -g apollo` };

  // install apollo
  taskLib.debug(`Install apollo`);
  await exec(renovateInstallOptions);

  // prepare run apollo
  const apolloArgs: string = `${aesOptionsAction} --key="${aesOptionsKey}" --endpoint="${aesOptionsEndpoint}"`;
  taskLib.debug(`apolloArgs to run: ${apolloArgs}`);

  // run apollo
  taskLib.debug(`Run apollo`);
  await exec({ tool: "apollo", arguments: `${apolloArgs}` });

  // the end!
  taskLib.debug(`Apollo done`);
}

async function exec(options: ExecutionOptions): Promise<void> {
  try {
    await taskLib.exec(options!.tool, options!.arguments);
  } catch (error) {
    const errorMessage: string = `exec(${options!.tool}, ${
      options!.arguments
    }): ${error}`;
    taskLib.error(errorMessage);
    throw new Error(errorMessage);
  }
}

run()
  .then(() => taskLib.setResult(taskLib.TaskResult.Succeeded, ""))
  .catch((err) => taskLib.setResult(taskLib.TaskResult.Failed, err));
