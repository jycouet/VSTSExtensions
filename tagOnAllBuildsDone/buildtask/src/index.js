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
const vsts = require("vso-node-api");
const BuildInterfaces_1 = require("vso-node-api/interfaces/BuildInterfaces");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env["TOKEN"] || taskLib.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        if (!token || token === '') {
            throw new Error(`You need to 'Allow scripts to access OAuth token' in the 'options' tab of your build system.`);
        }
        const project = process.env["SYSTEM_TEAMPROJECT"];
        if (!project) {
            throw new Error(`Could not determine project name. This task may not be compatible with your build system.`);
        }
        const repo = process.env["BUILD_REPOSITORY_NAME"];
        if (!repo) {
            throw new Error(`Could not determine repository name. This task may not be compatible with your build system.`);
        }
        const currentBuildSourceBranch = process.env["BUILD_SOURCEBRANCH"];
        if (!currentBuildSourceBranch) {
            throw new Error(`Could not determine the current Build Source Branch. This task may not be compatible with your build system.`);
        }
        const currentBuildSourceVersion = process.env["BUILD_SOURCEVERSION"];
        if (!currentBuildSourceVersion) {
            throw new Error(`Could not determine the current Build Source Version. This task may not be compatible with your build system.`);
        }
        const endpointAndCollection = process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"];
        if (!endpointAndCollection) {
            throw new Error(`Could not determine build server uri. This task may not be compatible with your build system.`);
        }
        const authHandler = vsts.getPersonalAccessTokenHandler(token);
        const vstsApi = new vsts.WebApi(endpointAndCollection, authHandler);
        const buildsInProgressOrQueued = yield vstsApi.getBuildApi().getBuilds(project, undefined, undefined, undefined, undefined, undefined, undefined, undefined, BuildInterfaces_1.BuildStatus.InProgress | BuildInterfaces_1.BuildStatus.NotStarted);
        const buildWithSameBranchAndSource = buildsInProgressOrQueued
            .filter(c => c.sourceBranch === currentBuildSourceBranch &&
            c.sourceVersion === currentBuildSourceVersion);
        if (buildWithSameBranchAndSource.length === 0) {
            taskLib.error('No build found! We should see at least the current build! Please contact the dev.');
        }
        else if (buildWithSameBranchAndSource.length === 1) {
            console.log(`Let's tag the current build`);
            console.log(`No other build running on the same source ('${currentBuildSourceBranch}' & '${currentBuildSourceVersion}')`);
            yield vstsApi.getBuildApi().addBuildTags(['allBuildsDone'], project, buildWithSameBranchAndSource[0].id);
            console.log(`Tag: 'allBuildsDone' added to the build ${buildWithSameBranchAndSource[0].id}`);
        }
        else {
            taskLib.warning(`Still ${buildWithSameBranchAndSource.length - 1} other build running on '${currentBuildSourceBranch}'`);
        }
        taskLib.debug(`Done`);
    });
}
run()
    .then(() => taskLib.setResult(taskLib.TaskResult.Succeeded, ""))
    .catch((err) => taskLib.setResult(taskLib.TaskResult.Failed, err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXlEO0FBQ3pELHFDQUFxQztBQUNyQyw2RUFBc0U7QUFFdEU7O1FBR0UsTUFBTSxLQUFLLEdBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLGlDQUFpQyxDQUFDLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqSixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUF1QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywyRkFBMkYsQ0FBQyxDQUFDO1FBQy9HLENBQUM7UUFFRCxNQUFNLElBQUksR0FBdUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUNsSCxDQUFDO1FBRUQsTUFBTSx3QkFBd0IsR0FBdUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3ZGLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEdBQThHLENBQUMsQ0FBQztRQUNsSSxDQUFDO1FBRUQsTUFBTSx5QkFBeUIsR0FBdUIsT0FBTyxDQUFDLEdBQUcsQ0FB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