---
id: backgroundcheck-boilerplate-workflow-implementation
title: Boilerplate Workflow Implementation
sidebar_label: Workflow code
description: In the Temporal Java SDK, a Workflow Definition is an interface and its implementation.
tags:
- java sdk
- developer guide
- workflow
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-java/blob/main/backgroundcheck/src/main/java/backgroundcheckboilerplate/BackgroundCheckBoilerplateWorkflowImpl.java. -->

Now that you've defined your Workflow Interface you can define its implementation.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-1551111370" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-1551111370" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-java/blob/main/backgroundcheck/src/main/java/backgroundcheckboilerplate/BackgroundCheckBoilerplateWorkflowImpl.java">view the source code</a> in the context of the rest of the application code.</div></div>

```java
import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;


public class BackgroundCheckBoilerplateWorkflowImpl implements BackgroundCheckBoilerplateWorkflow {

  // Define the Activity Execution options
  // StartToCloseTimeout or ScheduleToCloseTimeout must be set
  ActivityOptions options = ActivityOptions.newBuilder()
          .setStartToCloseTimeout(Duration.ofSeconds(5))
          .build();

  // Create an client stub to activities that implement the given interface
  private final BackgroundCheckBoilerplateActivities activities =
      Workflow.newActivityStub(BackgroundCheckBoilerplateActivities.class, options);

  @Override
  public String backgroundCheck(String socialSecurityNumber) {
    String ssnTraceResult = activities.ssnTraceActivity(socialSecurityNumber);
    return ssnTraceResult;
  }

}
```
