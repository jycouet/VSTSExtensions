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
        const renovateArgs = `${repo} --platform vsts --endpoint ${endpointAndCollection} --token ${token}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsOENBQThDO0FBRTlDO0NBR0M7QUFFRDs7UUFHRSxNQUFNLGtCQUFrQixHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLGlGQUFpRixDQUFDLENBQUM7UUFDckcsQ0FBQztRQUdELE1BQU0sS0FBSyxHQUF1QixPQUFPLENBQUMsaUNBQWlDLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pILEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUNsSCxDQUFDO1FBRUQsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFMUUsTUFBTSxJQUFJLEdBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0RSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUVELE1BQU0scUJBQXFCLEdBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNwRyxFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLCtGQUErRixDQUFDLENBQUM7UUFDbkgsQ0FBQztRQUdELElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUM7WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDNUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsMkVBQTJFLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBR0QsTUFBTSxzQkFBc0IsR0FBcUIsYUFBYTtZQUM1RCxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsc0JBQXNCLEVBQUUsRUFBRTtZQUM5RSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO1FBR2hGLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBR25DLE1BQU0sWUFBWSxHQUFXLEdBQUcsSUFBSSwrQkFBK0IscUJBQXFCLFlBQVksS0FBSyxFQUFFLENBQUM7UUFDNUcsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUd0RCxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxDQUFDO1lBQ1QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBR0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQUE7QUFFRCxjQUFvQixPQUF5Qjs7UUFDM0MsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsT0FBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxZQUFZLEdBQVcsUUFBUSxPQUFRLENBQUMsSUFBSSxLQUFLLE9BQVEsQ0FBQyxTQUFTLE1BQU0sS0FBSyxFQUFFLENBQUM7WUFDdkYsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0NBQUE7QUFFRCxHQUFHLEVBQUU7S0FDRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQ1QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FDcEQ7S0FDQSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUNiLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQ2xELENBQUMifQ==