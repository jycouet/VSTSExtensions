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
const taskLib = require("vsts-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        if (!token || token === '') {
            throw Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
        }
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
            tl.warning(`yarn not found... don't worry we will use npm... but it will be slower...`);
        }
        const tool = isYarnCapable ? 'yarn' : 'npm';
        const args = isYarnCapable ? 'global add renovate@' + renovateOptionsVersion : 'install -g renovate@' + renovateOptionsVersion;
        tl.debug(`Install renovate`);
        yield exec(tool, args);
        const renovateArgs = `${repo} --platform vsts --endpoint ${instance}DefaultCollection --token ${token}`;
        tl.debug(`renovateArgs to run: ${renovateArgs}`);
        tl.debug(`Run renovate`);
        yield exec('renovate', renovateArgs);
        tl.debug(`Renovate done`);
    });
}
function exec(tool, args) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tl.exec(tool, args)
            .catch(err => {
            tl.error(`exec(${tool}, ${args}): ${err}`);
            throw Error(`exec(${tool}, ${args}): ${err}`);
        })
            .then();
    });
}
run()
    .then(() => taskLib.setResult(taskLib.TaskResult.Succeeded, ""))
    .catch((err) => taskLib.setResult(taskLib.TaskResult.Failed, err));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLDhDQUE4QztBQUU5Qzs7UUFHRSxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUMsaUNBQWlDLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7UUFDOUcsQ0FBQztRQUVELE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFHOUQsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQztZQUNILEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtZQUN0QyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQywyRUFBMkUsQ0FBQyxDQUFBO1FBQ3pGLENBQUM7UUFHRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO1FBRy9ILEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM3QixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFHdkIsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLCtCQUErQixRQUFRLDZCQUE2QixLQUFLLEVBQUUsQ0FBQztRQUN4RyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBR2pELEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekIsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBR3JDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUFBO0FBRUQsY0FBb0IsSUFBWSxFQUFFLElBQVk7O1FBQzVDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNYLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDM0MsTUFBTSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxFQUFFLENBQUE7SUFDWCxDQUFDO0NBQUE7QUFFRCxHQUFHLEVBQUU7S0FDRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQ1QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FDcEQ7S0FDQSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUNiLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQ2xELENBQUM7QUFBQSxDQUFDIn0=