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
const taskLib = require("azure-pipelines-task-lib/task");
class ExecutionOptions {
    constructor() {
        this.tool = '';
        this.arguments = '';
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const aesOptionsAction = taskLib.getInput("aesOptionsAction") === 'publish' ? 'schema:publish' : 'schema:check';
        const aesOptionsKey = taskLib.getInput("aesOptionsKey");
        const aesOptionsEndpoint = taskLib.getInput("aesOptionsEndpoint");
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
            ? { tool: 'yarn', arguments: `global add apollo` }
            : { tool: 'npm', arguments: `install -g apollo` };
        taskLib.debug(`Install apollo`);
        yield exec(renovateInstallOptions);
        const apolloArgs = `${aesOptionsAction} --key="${aesOptionsKey}" --endpoint="${aesOptionsEndpoint}"`;
        taskLib.debug(`apolloArgs to run: ${apolloArgs}`);
        taskLib.debug(`Run apollo`);
        yield exec({
            tool: 'apollo',
            arguments: apolloArgs
        });
        taskLib.debug(`Apollo done`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXlEO0FBRXpEO0lBQUE7UUFDUyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsY0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0NBQUE7QUFFRDs7UUFFRSxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDaEgsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RCxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUdsRSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQzVDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsT0FBTyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUdELE1BQU0sc0JBQXNCLEdBQXFCLGFBQWE7WUFDNUQsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUU7WUFDbEQsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztRQUdwRCxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUduQyxNQUFNLFVBQVUsR0FBVyxHQUFHLGdCQUFnQixXQUFXLGFBQWEsaUJBQWlCLGtCQUFrQixHQUFHLENBQUM7UUFDN0csT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUdsRCxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVCLE1BQU0sSUFBSSxDQUFDO1lBQ1QsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsVUFBVTtTQUN0QixDQUFDLENBQUM7UUFHSCxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FBQTtBQUVELGNBQW9CLE9BQXlCOztRQUMzQyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDLElBQUksRUFBRSxPQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLFlBQVksR0FBVyxRQUFRLE9BQVEsQ0FBQyxJQUFJLEtBQUssT0FBUSxDQUFDLFNBQVMsTUFBTSxLQUFLLEVBQUUsQ0FBQztZQUN2RixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELEdBQUcsRUFBRTtLQUNGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDVCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUNwRDtLQUNBLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQ2IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FDbEQsQ0FBQyJ9