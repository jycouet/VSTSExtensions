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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        process.env["VSTS_TOKEN"] = tl.getInput("personalAccessToken");
        const renovateOptionsVersion = tl.getInput("renovateOptionsVersion");
        const repo = process.env["BUILD_REPOSITORY_NAME"];
        const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"];
        let isYarnCapable = false;
        try {
            tl.which('yarn', true);
            tl.debug('Yeahhh, yarn is installed!');
            isYarnCapable = true;
        }
        catch (error) {
            tl.warning(`yarn not found... don't worry we will use npm... but it will be slow...`);
        }
        const tool = isYarnCapable ? 'yarn' : 'npm';
        const args = isYarnCapable ? 'global add renovate@' + renovateOptionsVersion : 'install -g renovate@' + renovateOptionsVersion;
        tl.debug(`Install renovate`);
        yield exec(tool, args);
        const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection`;
        tl.debug(`renovateArgs to run: ${renovateArgs}`);
        tl.debug(`Run renovate`);
        yield exec('renovate', renovateArgs);
        tl.debug(`Renovate done`);
    });
}
function exec(tool, args) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 0;
        yield tl.exec(tool, args)
            .catch(err => {
            tl.error(`exec(${tool}, ${args}): ${err}`);
            result = 0;
        })
            .then(c => {
            result = 1;
        });
        return result;
    });
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBRXpDOztRQUdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFHOUQsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQztZQUNILEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtZQUN0QyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1FBQ3ZGLENBQUM7UUFHRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO1FBRy9ILEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM3QixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFHdkIsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLCtCQUErQixRQUFRLG1CQUFtQixDQUFDO1FBQ3ZGLEVBQUUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLFlBQVksRUFBRSxDQUFDLENBQUM7UUFHakQsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFHckMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQUE7QUFFRCxjQUFvQixJQUFZLEVBQUUsSUFBWTs7UUFDNUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMzQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1IsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQUE7QUFFRCxHQUFHLEVBQUUsQ0FBQyJ9