# Renovate Me

> Hey you, yes you, you are at the right place :) <br>
> You want to keep track of your dependencies?

This build task is helping you to use [renovate](https://github.com/singapore/renovate) directly with your VSTS **git** repo. (Check their nice [Doc](https://docs.renovatebot.com/) if you want to know more)

## Tips: use a yaml file

Find an example here: [RenovateMe.yaml](./RenovateMe.yaml)

## Task Setup

- Select a linux Agent queue
- Check that your `Project collection build service` as the right to
  - **Create branch**
  - **Contribute to Pull Request**
  - **Force Push** _(if you want renovate to delete branchs when closing outdated renovations)_
- Make sure you are on a node >= 10.13.0
- _Optional_: install yarn

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

### tasks

![tasks](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_tasks.png)

### OAuth Token should be able to create a branch

![version_control](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_versioncontrol.png)
