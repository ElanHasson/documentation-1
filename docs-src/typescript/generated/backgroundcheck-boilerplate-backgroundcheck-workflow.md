---
id: backgroundcheck-boilerplate-backgroundcheck-workflow
title: Boilerplate Workflow code
sidebar_label: Workflow code
description: In the Temporal TypeScript SDK programming model, an Activity Definition is an exportable function or an `object` method.
tags:
- typescript sdk
- developer guide
- workflow
- code sample
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-typescript/blob/main/chapter_durable_execution/backgroundcheck/src/workflows.ts. -->

In the Temporal TypeScript SDK programming model, a [Workflow Definition](/concepts/what-is-a-workflow-definition) is an exportable function.

Open the `src/workflows.ts` file in your editor. You'll place your Workflow Definition in this file.

To define a Workflow, import the Activity types and the `@temporalio/workflow` libraries:
Define the Activity Execution options. `StartToCloseTimeout` or `ScheduleToCloseTimeout` must be set:
The `backgroundCheck` function that follows is an example of a basic Workflow Definition.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-875416512" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-875416512" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-typescript/blob/main/chapter_durable_execution/backgroundcheck/src/workflows.ts">view the source code</a> in the context of the rest of the application code.</div></div>

```typescript
import * as workflow from '@temporalio/workflow';
import type * as activities from './activities';

const { ssnTrace } = workflow.proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
});

export async function backgroundCheck(ssn: string): Promise<string> {
  return await ssnTrace(ssn);
}
```
