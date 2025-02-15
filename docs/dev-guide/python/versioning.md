---
id: versioning
title: Python SDK developer's guide - Versioning
sidebar_label: Versioning
sidebar_position: 9
description: The Versioning section of the Temporal Developer's guide covers how to update Workflow Definitions without causing non-deterministic behavior in current long-running Workflows.
slug: /dev-guide/python/versioning
toc_max_heading_level: 4
keywords:
- best practices
- code sample
- deployment
- deployment safety
- deprecated patches
- how-to
- patching
- python
- python sdk
- version
- versioning
- workflow completion
- workflow history
- workflow transition
tags:
- best-practices
- code-sample
- deployment
- deployment-safety
- deprecated-patches
- how-to
- patching
- python
- python-sdk
- version
- versioning
- workflow-completion
- workflow-history
- workflow-transition
---

<!-- THIS FILE IS GENERATED. DO NOT EDIT THIS FILE DIRECTLY -->

The definition code of a Temporal Workflow must be deterministic because Temporal uses event sourcing
to reconstruct the Workflow state by replaying the saved history event data on the Workflow
definition code. This means that any incompatible update to the Workflow Definition code could cause
a non-deterministic issue if not handled correctly.

## Introduction to Versioning

Because we design for potentially long running Workflows at scale, versioning with Temporal works differently. We explain more in this optional 30 minute introduction: [https://www.youtube.com/watch?v=kkP899WxgzY](https://www.youtube.com/watch?v=kkP899WxgzY)

## How to use Worker Versioning in Python {#worker-versioning}

To use [Worker Versioning](/workers#worker-versioning) in Python, you need to do the following:

1. Determine and assign a Build ID to your built Worker code, and opt in to versioning.
2. Tell the Task Queue your Worker is listening on that Build ID, and whether it's compatible with an existing Build ID.

### Assign a Build ID to your Worker

Let's say you've chosen `deadbeef` as your Build ID, which might be a short git commit hash (a reasonable choice as Build ID).
To assign it in your Worker code, assign at least the following Worker Options:

```python
# ...
worker = Worker(
  task_queue="your_task_queue_name",
  build_id="deadbeef",
  use_worker_versioning=True,
  # ... register workflows & activities, etc
)
# ...
```

That's all you need to do in your Worker code.
Importantly, if you start this Worker, it won't receive any tasks yet.
That's because you need to tell the Task Queue about your Worker's Build ID first.

### Tell the Task Queue about your Worker's Build ID

Now you can use the SDK (or the Temporal CLI) to tell the Task Queue about your Worker's Build ID.
You might want to do this as part of your CI deployment process.

```python
# ...
await client.update_worker_build_id_compatibility(
    "your_task_queue_name", BuildIdOpAddNewDefault("deadbeef")
)
```

This code adds the `deadbeef` Build ID to the Task Queue as the sole version in a new version set, which becomes the default for the queue.
New Workflows execute on Workers with this Build ID, and existing ones will continue to process by appropriately compatible Workers.

If, instead, you want to add the Build ID to an existing compatible set, you can do this:

```python
# ...
await client.update_worker_build_id_compatibility(
    "your_task_queue_name", BuildIdOpAddNewCompatible("deadbeef", "some-existing-build-id")
)
```

This code adds `deadbeef` to the existing compatible set containing `some-existing-build-id` and marks it as the new default Build ID for that set.

You can also promote an existing Build ID in a set to be the default for that set:

```python
# ...
await client.update_worker_build_id_compatibility(
    "your_task_queue_name", BuildIdOpPromoteBuildIdWithinSet("deadbeef")
)
```

You can also promote an entire set to become the default set for the queue. New Workflows will start using that set's default build.

```python
# ...
await client.update_worker_build_id_compatibility(
    "your_task_queue_name", BuildIdOpPromoteSetByBuildId("deadbeef")
)
```

### Specify versions for Commands

By default, Activities, Child Workflows, and Continue-as-New use the same compatible version set as
the Workflow that invoked them if they're also using the same Task Queue.

If you want to override this behavior, you can specify your intent via the `versioning_intent`
argument available on the methods you use to invoke these Commands.

For more information refer to the [conceptual documentation](/workers#worker-versioning).

For example, if you want to use the latest default version for an Activity, you can call it like so:

```python
# ...
await workflow.execute_activity(
    say_hello,
    "hi",
    versioning_intent=VersioningIntent.DEFAULT,
    start_to_close_timeout=timedelta(seconds=5),
)
# ...
```

## How to use the Python SDK Patching API {#python-sdk-patching-api}

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_1_initial_dacx.py. -->

In principle, the Python SDK's patching mechanism operates similarly to other SDKs in a "feature-flag" fashion. However, the "versioning" API now uses the concept of "patching in" code.

To understand this, you can break it down into three steps, which reflect three stages of migration:

- Running `pre_patch_activity` code while concurrently patching in `post_patch_activity`.
- Running `post_patch_activity` code with deprecation markers for `my-patch` patches.
- Running only the `post_patch_activity` code.

Let's walk through this process in sequence.

Suppose you have an initial Workflow version called `pre_patch_activity`:

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-320531399" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-320531399" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_1_initial_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
from datetime import timedelta

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from activities import pre_patch_activity
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        self._result = await workflow.execute_activity(
            pre_patch_activity,
            schedule_to_close_timeout=timedelta(minutes=5),
        )
```

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py. -->

Now, you want to update your code to run `post_patch_activity` instead. This represents your desired end state.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id1535107364" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id1535107364" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
from datetime import timedelta

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from activities import post_patch_activity
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        self._result = await workflow.execute_activity(
            post_patch_activity,
            schedule_to_close_timeout=timedelta(minutes=5),
        )
```

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py. -->

**Problem: You cannot deploy `post_patch_activity` directly until you're certain there are no more running Workflows created using the `pre_patch_activity` code, otherwise you are likely to cause a non-deterministic error.**

Instead, you'll need to deploy `post_patched_activity` and use the [patched](https://python.temporal.io/temporalio.workflow.html#patched) function to determine which version of the code to execute.

Implementing patching involves three steps:

1. Use [patched](https://python.temporal.io/temporalio.workflow.html#patched) to patch in new code and run it alongside the old code.
2. Remove the old code and apply [deprecate_patch](https://python.temporal.io/temporalio.workflow.html#deprecate_patch).
3. Once you're confident that all old Workflows have finished executing, remove `deprecate_patch`.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id1535107364" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id1535107364" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        self._result = await workflow.execute_activity(
            post_patch_activity,
            schedule_to_close_timeout=timedelta(minutes=5),
        )
```

### Patching in new code {#using-patched-for-workflow-history-markers}

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_2_patched_dacx.py. -->

Using `patched` inserts a marker into the Workflow History.

![image](https://user-images.githubusercontent.com/6764957/139673361-35d61b38-ab94-401e-ae7b-feaa52eae8c6.png)

During replay, if a Worker encounters a history with that marker, it will fail the Workflow task when the Workflow code doesn't produce the same patch marker (in this case, `my-patch`). This ensures you can safely deploy code from `post_patch_activity` as a "feature flag" alongside the original version (`pre_patch_activity`).

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-1858174243" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-1858174243" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_2_patched_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        if workflow.patched("my-patch"):
            self._result = await workflow.execute_activity(
                post_patch_activity,
                schedule_to_close_timeout=timedelta(minutes=5),
            )
        else:
            self._result = await workflow.execute_activity(
                pre_patch_activity,
                schedule_to_close_timeout=timedelta(minutes=5),
            )
```

### Understanding deprecated Patches in the Python SDK {#deprecated-patches}

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_3_patch_deprecated_dacx.py. -->

After ensuring that all Workflows started with `pre_patch_activity` code have finished, you can [deprecate the patch](https://python.temporal.io/temporalio.workflow.html#deprecate_patch).

Deprecated patches serve as a bridge between `pre_patch_activity` and `post_patch_activity`. They function similarly to regular patches by adding a marker to the Workflow History. However, this marker won't cause a replay failure when the Workflow code doesn't produce it.

If, during the deployment of `post_patch_activity`, there are still live Workers running `pre_patch_activity` code and these Workers pick up Workflow histories generated by `post_patch_activity`, they will safely use the patched branch.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-2026265793" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-2026265793" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_3_patch_deprecated_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        workflow.deprecate_patch("my-patch")
        self._result = await workflow.execute_activity(
            post_patch_activity,
            schedule_to_close_timeout=timedelta(minutes=5),
        )
```

### Safe Deployment of post_patch_activity {#deploy-new-code}

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py. -->

You can safely deploy `post_patch_activity` once all Workflows labeled my-patch or earlier are finished, based on the previously mentioned assertion.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id1535107364" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id1535107364" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-python/blob/main/version_your_workflows/workflow_4_patch_complete_dacx.py">view the source code</a> in the context of the rest of the application code.</div></div>

```python
# ...
@workflow.defn
class MyWorkflow:
    @workflow.run
    async def run(self) -> None:
        self._result = await workflow.execute_activity(
            post_patch_activity,
            schedule_to_close_timeout=timedelta(minutes=5),
        )
```
