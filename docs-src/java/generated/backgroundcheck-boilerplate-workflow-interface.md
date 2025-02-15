---
id: backgroundcheck-boilerplate-workflow-interface
title: Boilerplate Workflow Interface
sidebar_label: Workflow code
description: In the Temporal Java SDK, a Workflow Definition is an interface and its implementation.
tags:
- java sdk
- developer guide
- workflow
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-java/blob/main/backgroundcheck/src/main/java/backgroundcheckboilerplate/BackgroundCheckBoilerplateWorkflow.java. -->

The `BackgroundCheckBoilerplateWorkflow` interface below is an example of a the first part of a Workflow Definition.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id263183478" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id263183478" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-java/blob/main/backgroundcheck/src/main/java/backgroundcheckboilerplate/BackgroundCheckBoilerplateWorkflow.java">view the source code</a> in the context of the rest of the application code.</div></div>

```java
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;


// Workflow Interfaces must be annotated with @WorkflowInterface
@WorkflowInterface
public interface BackgroundCheckBoilerplateWorkflow {

  // The Workflow Method within the interface must be annotated with @WorkflowMethod
  @WorkflowMethod
  public String backgroundCheck(String socialSecurityNumber);

}
```
