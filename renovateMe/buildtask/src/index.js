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
const npmRun = require('npm-run');
const tl = require("vsts-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const personalAccessToken = tl.getInput("personalAccessToken");
        const repo = process.env["BUILD_REPOSITORY_NAME"];
        const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"];
        const cmd = `renovate ${repo} --token ${personalAccessToken} --platform vsts --endpoint ${instance}DefaultCollection`;
        if (process.env["LOG_LEVEL"] === 'debug') {
            console.log(cmd);
        }
        npmRun.exec(cmd, {}, function (err, stdout, stderr) {
            if (err) {
                console.log('error', stderr);
            }
            console.log('Renovate done:', stdout);
        });
    });
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLHlDQUF5QztBQUV6Qzs7UUFFRSxNQUFNLG1CQUFtQixHQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2RSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbEQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBRTlELE1BQU0sR0FBRyxHQUFHLFlBQVksSUFBSSxZQUFZLG1CQUFtQiwrQkFBK0IsUUFBUSxtQkFBbUIsQ0FBQztRQUN0SCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUNqQixVQUFVLEdBQVEsRUFBRSxNQUFXLEVBQUUsTUFBVztZQUMxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLENBQUM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUFBO0FBRUQsR0FBRyxFQUFFLENBQUMifQ==