# Renovate Me

> Hey you, yes you, you are at the right place :) <br>
You want to keep track of your dependencies?

This build task is helping you to use [renovate](https://github.com/singapore/renovate) directly with your VSTS **git** repo.

## Task Setup

- Select a linux Agent queue
- Activate the option: **Allow scripts to access OAuth token** in **Options** Tab
- Check that your `Project collection build service` as the right to **create branch**.
- Make sure you are on a node > 8.8.x
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
