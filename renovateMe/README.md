# Renovate Me

> Hey you, yes you, you are at the right place :) <br>
> You want to keep track of your dependencies?

This build task is helping you to use [renovate](https://github.com/renovatebot/renovate) directly with your Azure DevOps Services **git** repo. (Check their nice [Doc](https://docs.renovatebot.com/) if you want to know more)

## Task Setup

- Select a linux Agent queue
- Check that your `Project collection build service` as the right to
  - **Create branch**
  - **Contribute to Pull Request**
  - **Force Push** _(if you want renovate to delete branchs when closing outdated renovations)_
- Make sure you are on a node >= 10.13.0
- _Optional_: install yarn

## Use a yaml file

Microsoft recommends to use multi-staging-pipelines and not the class build / release pipelines. Below you see an example

```yaml
  - task: geeklearningio.gl-vsts-tasks-yarn.yarn-installer-task.YarnInstaller@3
    displayName: 'Use yarn'

  - task: NodeTool@0
    displayName: 'Use node'
    inputs:
    versionSpec: <your node version>

  - task: jyc.vsts-extensions-renovate-me.default-build-task.RenovateMe@1
    input:
      renovateOptionsVersion: 10.3.0 # optional | semantic version of the renovate version to use
      renovateOptionsArgs: '--ignore-unstable=false' # optional | see the folowing for all options https://docs.renovatebot.com/self-hosted-configuration/
    displayName: Run renovate
```

### _Optional_ Add a Github token so RenovateBot can pull release notes

- In Github, head to your account -> Settings -> Developer settings -> Personal access tokens -> Generate new token -> Generate new token (no need to tick any boxes - this token just needs to be able to read public github data). Copy the new PAT
- In your pipeline, add a new Pipeline Variable, `GITHUB_COM_TOKEN`, and paste your new PAT as the value. Tick the box to tell Azure Devops this is a secret.
- In your Renovate task, add the following in Options -> Additional args:

```
--host-rules="[{\"domainName\":\"github.com\",\"token\":\"$(GITHUB_COM_TOKEN)\"}]"
```

The PRs that get created should now include release notes about the new updates.

## In action

![gif](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/renovate_me.gif)

## Basic build definition

**Important**: it is not recommended to use classic build / release definitions anymore.

### tasks

![tasks](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_tasks.png)

### OAuth Token should be able to create a branch

![version_control](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_versioncontrol.png)
