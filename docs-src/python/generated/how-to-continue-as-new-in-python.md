---
id: how-to-continue-as-new-in-python
title: How to Continue-As-New in Python
sidebar_label: Continue-As-New
description: To Continue-As-New in Python, call the continue_as_new() function from inside your Workflow, which will stop the Workflow immediately and Continue-As-New.
tags:
- continue-as-new
- python sdk
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/continue_as_new/your_workflows_dacx.py. -->

To Continue-As-New in Python, call the [`continue_as_new()`](https://python.temporal.io/temporalio.workflow.html#continue_as_new) function from inside your Workflow, which will stop the Workflow immediately and Continue-As-New.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-615878827" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-615878827" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/continue_as_new/your_workflows_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
@workflow.defn
class LoopingWorkflow:
    @workflow.run
    async def run(self, iteration: int) -> None:
        if iteration == 5:
            return
        await asyncio.sleep(10)
        workflow.continue_as_new(iteration + 1)
```
