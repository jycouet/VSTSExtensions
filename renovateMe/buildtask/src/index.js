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
        const token = taskLib.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        if (!token || token === '') {
            throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
        }
        const renovateOptionsVersion = taskLib.getInput("renovateOptionsVersion");
        const repo = process.env["BUILD_REPOSITORY_NAME"];
        if (!repo) {
            throw new Error(`Could not determine repository name. This task may not be compatible with your build system.`);
        }
        const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"];
        if (!instance) {
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
        const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection --token ${token}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsOENBQThDO0FBRTlDO0NBR0M7QUFFRDs7UUFHRSxNQUFNLEtBQUssR0FBa0IsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwSCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUVELE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sSUFBSSxHQUFrQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RkFBOEYsQ0FBQyxDQUFDO1FBQ2xILENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBa0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLENBQUMsQ0FBQztRQUNuSCxDQUFDO1FBR0QsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQztZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUM1QyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsT0FBTyxDQUFDLE9BQU8sQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFHRCxNQUFNLHNCQUFzQixHQUFxQixhQUFhO1lBQzVELENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixzQkFBc0IsRUFBRSxFQUFFO1lBQzlFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixzQkFBc0IsRUFBRSxFQUFFLENBQUM7UUFHaEYsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFHbkMsTUFBTSxZQUFZLEdBQVcsR0FBRyxJQUFJLCtCQUErQixRQUFRLDZCQUE2QixLQUFLLEVBQUUsQ0FBQztRQUNoSCxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBR3RELE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUIsTUFBTSxJQUFJLENBQUM7WUFDVCxJQUFJLEVBQUUsVUFBVTtZQUNoQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUM7UUFHSCxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FBQTtBQUVELGNBQW9CLE9BQXlCOztRQUMzQyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDLElBQUksRUFBRSxPQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLFlBQVksR0FBVyxRQUFRLE9BQVEsQ0FBQyxJQUFJLEtBQUssT0FBUSxDQUFDLFNBQVMsTUFBTSxLQUFLLEVBQUUsQ0FBQztZQUN2RixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELEdBQUcsRUFBRTtLQUNGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDVCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUNwRDtLQUNBLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQ2IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FDbEQsQ0FBQyJ9