---
id: how-to-set-a-parent-close-policy-in-python
title: How to set a Parent Close Policy in Python
sidebar_label: Parent Close Policy
description: Create an instance of the `ParentClosePolicy` class.
tags:
- parent close policy
- python sdk
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/your_child_workflow/your_child_workflow_dacx.py. -->

Set the `parent_close_policy` parameter inside the [`start_child_workflow`](https://python.temporal.io/temporalio.workflow.html#start_child_workflow) function or the [`execute_child_workflow()`](https://python.temporal.io/temporalio.workflow.html#execute_child_workflow) function to specify the behavior of the Child Workflow when the Parent Workflow closes.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-197590512" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-197590512" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/your_child_workflow/your_child_workflow_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
from temporalio.workflow import ParentClosePolicy
# ...
# ...
@workflow.defn
class ComposeGreetingWorkflow:
    @workflow.run
    async def run(self, input: ComposeGreetingInput) -> str:
        return f"{input.greeting}, {input.name}!"


@workflow.defn
class GreetingWorkflow:
    @workflow.run
    async def run(self, name: str) -> str:
        return await workflow.execute_child_workflow(
            ComposeGreetingWorkflow.run,
            ComposeGreetingInput("Hello", name),
            id="hello-child-workflow-workflow-child-id",
            parent_close_policy=ParentClosePolicy.ABANDON,
        )
```
