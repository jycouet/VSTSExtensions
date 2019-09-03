# Renovate Me

> Hey you, yes you, you are at the right place :) <br>
You want to keep track of your dependencies?

This build task is helping you to use [renovate](https://github.com/singapore/renovate) directly with your VSTS **git** repo.

## Task Setup

- Select a linux Agent queue
- Check that your `Project collection build service` as the right to **create branch** & **Contribute to Pull Request**.
- Make sure you are on a node >= 10.13.0
- _Optional_: install yarn

## In action

![gif](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/renovate_me.gif)

## Basic build definition

### tasks

![tasks](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_tasks.png)

### options

![options](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_options.png)

### OAuth Token should be able to create a branch

![version_control](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_versioncontrol.png)
