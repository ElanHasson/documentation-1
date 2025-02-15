---
id: how-to-set-a-workflow-id-in-python
title: How to set a Workflow Id in Python
sidebar_label: Set a Workflow Id
description: Set a Workflow Id
tags:
- workflow
- python sdk
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/your_app/run_workflow_dacx.py. -->

To set a Workflow Id in Python, specify the `id` argument when executing a Workflow with either [`start_workflow()`](https://python.temporal.io/temporalio.client.Client.html#start_workflow) or [`execute_workflow()`](https://python.temporal.io/temporalio.client.Client.html#execute_workflow) methods.

The `id` argument should be a unique identifier for the Workflow Execution.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id1634906992" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id1634906992" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/your_app/run_workflow_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
async def main():
    client = await Client.connect("localhost:7233")

    result = await client.execute_workflow(
        YourWorkflow.run,
        "your name",
        id="your-workflow-id",
        task_queue="your-task-queue",
    )

    print(f"Result: {result}")


if __name__ == "__main__":
    asyncio.run(main())
```
