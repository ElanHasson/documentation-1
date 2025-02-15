---
id: backgroundcheck-boilerplate-backgroundcheck-workflow
title: Boilerplate Workflow code
sidebar_label: Workflow code
description: In the Temporal Python SDK programming model, a Workflow Definition is defined as a class.
tags:
- go sdk
- developer guide
- workflow
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/backgroundcheck_boilerplate/workflows/backgroundcheck_dacx.py. -->

In the Temporal Python SDK programming model, a Workflow Definition is defined as a class.
The `BackgroundCheck class` below is an example of a basic Workflow Definition.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id1674382023" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id1674382023" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/backgroundcheck_boilerplate/workflows/backgroundcheck_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
from datetime import timedelta

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from activities.ssntraceactivity_dacx import ssn_trace_activity



@workflow.defn
class BackgroundCheck:
    @workflow.run
    async def run(self, ssn: str) -> str:
        return await workflow.execute_activity(
            ssn_trace_activity,
            ssn,
            schedule_to_close_timeout=timedelta(seconds=5),
        )
```
