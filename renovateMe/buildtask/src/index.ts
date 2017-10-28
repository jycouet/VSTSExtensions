const npmRun = require('npm-run');
import * as tl from "vsts-task-lib/task";

async function run() {

  const personalAccessToken: string = tl.getInput("personalAccessToken");
  const repo = process.env["BUILD_REPOSITORY_NAME"];
  const instance = process.env["SYSTEM_TEAMFOUNDATIONSERVERURI"]

  const cmd = `renovate ${repo} --token ${personalAccessToken} --platform vsts --endpoint ${instance}DefaultCollection`;
  if (process.env["LOG_LEVEL"] === 'debug') {
    console.log(cmd);
  }

  npmRun.exec(cmd, {},
    function (err: any, stdout: any, stderr: any) {
      if (err) {
        console.log('error', stderr);
      }
      console.log('Renovate done:', stdout);
    });
}

run();