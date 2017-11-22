"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskLib = require("vsts-task-lib/task");
class ExecutionOptions {
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceCodeProvider = process.env["BUILD_REPOSITORY_PROVIDER"] || '';
        if (sourceCodeProvider !== 'TfsGit') {
            throw new Error(`Sorry, we support only TfsGit for now. Please post an issue if you need more :)`);
        }
        const token = taskLib.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        if (!token || token === '') {
            throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
        }
        const renovateOptionsVersion = taskLib.getInput("renovateOptionsVersion");
        const project = process.env["SYSTEM_TEAMPROJECT"];
        if (!project) {
            throw new Error(`Could not determine project name. This task may not be compatible with your build system.`);
        }
        const repo = process.env["BUILD_REPOSITORY_NAME"];
        if (!repo) {
            throw new Error(`Could not determine repository name. This task may not be compatible with your build system.`);
        }
        const endpointAndCollection = process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"];
        if (!endpointAndCollection) {
            throw new Error(`Could not determine build server uri. This task may not be compatible with your build system.`);
        }
        let isYarnCapable = false;
        try {
            taskLib.which('yarn', true);
            taskLib.debug('Yeahhh, yarn is installed!');
            isYarnCapable = true;
        }
        catch (error) {
            taskLib.warning(`yarn not found... don't worry we will use npm... but it will be slower...`);
        }
        const renovateInstallOptions = isYarnCapable
            ? { tool: 'yarn', arguments: `global add renovate@${renovateOptionsVersion}` }
            : { tool: 'npm', arguments: `install -g renovate@${renovateOptionsVersion}` };
        taskLib.debug(`Install renovate`);
        yield exec(renovateInstallOptions);
        const renovateArgs = `${project}/${repo} --platform vsts --endpoint ${endpointAndCollection} --token ${token}`;
        taskLib.debug(`renovateArgs to run: ${renovateArgs}`);
        taskLib.debug(`Run renovate`);
        yield exec({
            tool: 'renovate',
            arguments: renovateArgs
        });
        taskLib.debug(`Renovate done`);
    });
}
function exec(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield taskLib.exec(options.tool, options.arguments);
        }
        catch (error) {
            const errorMessage = `exec(${options.tool}, ${options.arguments}): ${error}`;
            taskLib.error(errorMessage);
            throw new Error(errorMessage);
        }
    });
}
run()
    .then(() => taskLib.setResult(taskLib.TaskResult.Succeeded, ""))
    .catch((err) => taskLib.setResult(taskLib.TaskResult.Failed, err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsOENBQThDO0FBRTlDO0NBR0M7QUFFRDs7UUFHRSxNQUFNLGtCQUFrQixHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLGlGQUFpRixDQUFDLENBQUM7UUFDckcsQ0FBQztRQUdELE1BQU0sS0FBSyxHQUF1QixPQUFPLENBQUMsaUNBQWlDLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pILEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUNsSCxDQUFDO1FBRUQsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFMUUsTUFBTSxPQUFPLEdBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0RSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLDJGQUEyRixDQUFDLENBQUM7UUFDL0csQ0FBQztRQUVELE1BQU0sSUFBSSxHQUF1QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RkFBOEYsQ0FBQyxDQUFDO1FBQ2xILENBQUM7UUFFRCxNQUFNLHFCQUFxQixHQUF1QixPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDcEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQywrRkFBK0YsQ0FBQyxDQUFDO1FBQ25ILENBQUM7UUFHRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQzVDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsT0FBTyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUdELE1BQU0sc0JBQXNCLEdBQXFCLGFBQWE7WUFDNUQsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLHNCQUFzQixFQUFFLEVBQUU7WUFDOUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsdUJBQXVCLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztRQUdoRixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbEMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUduQyxNQUFNLFlBQVksR0FBVyxHQUFHLE9BQU8sSUFBSSxJQUFJLCtCQUErQixxQkFBcUIsWUFBWSxLQUFLLEVBQUUsQ0FBQztRQUN2SCxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBR3RELE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUIsTUFBTSxJQUFJLENBQUM7WUFDVCxJQUFJLEVBQUUsVUFBVTtZQUNoQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUM7UUFHSCxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FBQTtBQUVELGNBQW9CLE9BQXlCOztRQUMzQyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDLElBQUksRUFBRSxPQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLFlBQVksR0FBVyxRQUFRLE9BQVEsQ0FBQyxJQUFJLEtBQUssT0FBUSxDQUFDLFNBQVMsTUFBTSxLQUFLLEVBQUUsQ0FBQztZQUN2RixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELEdBQUcsRUFBRTtLQUNGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDVCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUNwRDtLQUNBLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQ2IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FDbEQsQ0FBQyJ9