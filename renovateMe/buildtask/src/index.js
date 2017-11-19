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
const tl = require("vsts-task-lib/task");
class ExecutionOptions {
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        if (!token || token === '') {
            throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
        }
        const renovateOptionsVersion = tl.getInput("renovateOptionsVersion");
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
            tl.which('yarn', true);
            tl.debug('Yeahhh, yarn is installed!');
            isYarnCapable = true;
        }
        catch (error) {
            tl.warning(`yarn not found... don't worry we will use npm... but it will be slower...`);
        }
        const renovateInstallOptions = new ExecutionOptions();
        if (isYarnCapable) {
            renovateInstallOptions.tool = 'yarn';
            renovateInstallOptions.arguments = 'global add renovate@' + renovateOptionsVersion;
        }
        else {
            renovateInstallOptions.tool = 'npm';
            renovateInstallOptions.arguments = 'install -g renovate@' + renovateOptionsVersion;
        }
        tl.debug(`Install renovate`);
        yield exec(renovateInstallOptions);
        const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection --token ${token}`;
        tl.debug(`renovateArgs to run: ${renovateArgs}`);
        tl.debug(`Run renovate`);
        yield exec({
            tool: 'renovate',
            arguments: renovateArgs
        });
        tl.debug(`Renovate done`);
    });
}
function exec(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tl.exec(options.tool, options.arguments);
        }
        catch (error) {
            const errorMessage = `exec(${options.tool}, ${options.arguments}): ${error}`;
            tl.error(errorMessage);
            throw new Error(errorMessage);
        }
    });
}
run()
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((err) => tl.setResult(tl.TaskResult.Failed, err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBRXpDO0NBR0M7QUFFRDs7UUFHRSxNQUFNLEtBQUssR0FBVyxFQUFFLENBQUMsaUNBQWlDLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUNsSCxDQUFDO1FBRUQsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFckUsTUFBTSxJQUFJLEdBQWtCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFrQixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDOUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQywrRkFBK0YsQ0FBQyxDQUFDO1FBQ25ILENBQUM7UUFHRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDO1lBQ0gsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO1lBQ3RDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixFQUFFLENBQUMsT0FBTyxDQUFDLDJFQUEyRSxDQUFDLENBQUE7UUFDekYsQ0FBQztRQUdELE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3RELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbEIsc0JBQXNCLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNyQyxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUM7UUFDckYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sc0JBQXNCLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNwQyxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUM7UUFDckYsQ0FBQztRQUdELEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM3QixNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBR25DLE1BQU0sWUFBWSxHQUFXLEdBQUcsSUFBSSwrQkFBK0IsUUFBUSw2QkFBNkIsS0FBSyxFQUFFLENBQUM7UUFDaEgsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUdqRCxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sSUFBSSxDQUFDO1lBQ1QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBR0gsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQUE7QUFFRCxjQUFvQixPQUF5Qjs7UUFDM0MsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsT0FBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxZQUFZLEdBQVcsUUFBUSxPQUFRLENBQUMsSUFBSSxLQUFLLE9BQVEsQ0FBQyxTQUFTLE1BQU0sS0FBSyxFQUFFLENBQUM7WUFDdkYsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0NBQUE7QUFFRCxHQUFHLEVBQUU7S0FDRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQ1QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FDMUM7S0FDQSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUNiLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQ3hDLENBQUMifQ==