# Tag On All Builds Done

We have a great Release pipeline in VSTS.

But, when we have multiple Artifacts building on the same source we want to trigger the release only once right?!

The idea of this task is to tag `allBuildsDone` when the **last** build triggerd by a source is done.

Simply add this task at the end of your build and the task will add the tag or not :-)

### options

![options](https://raw.githubusercontent.com/jycouet/VSTSExtensions/master/renovateMe/images/build_options.png)