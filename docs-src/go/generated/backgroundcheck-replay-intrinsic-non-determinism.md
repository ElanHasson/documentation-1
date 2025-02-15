---
id: backgroundcheck-replay-intrinsic-non-determinism
title: Intrinsic non-deterministic logic
sidebar_label: intrinsic-non-deterministic-logic
description: This kind of logic prevents the Workflow code from executing to completion because the Workflow can take a different code path than the one expected from the Event History.
tags:
- tests
- replay
- event history
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-go/blob/main/backgroundcheck_replay/workflows/backgroundcheck_non_deterministic_code.go. -->

Referred to as "intrinsic non-determinism" this kind of "bad" Workflow code can prevent the Workflow code from completing because the Workflow can take a different code path than the one expected from the Event History.

The following are some common operations that **can't** be done inside of a Workflow Definition:

- Generate and rely on random numbers (Use Activites instead).
- Accessing / mutating external systems or state.
  This includes calling an external API, conducting a file I/O operation, talking to another service, etc. (use Activities instead).
- Relying on system time.
  - Use `workflow.Now()` as a replacement for `time.Now()`.
  - Use `workflow.Sleep()` as a replacement for `time.Sleep()`.
- Working directly with threads or goroutines.
  - Use `workflow.Go()` as a replacement for the `go` statement.
  - Use `workflow.Channel()` as a replacement for the native `chan` type.
    Temporal provides support for both buffered and unbuffered channels.
  - Use `workflow.Selector()` as a replacement for the `select` statement.
- Iterating over data structures with unknown ordering.
  This includes iterating over maps using `range`, because with `range` the order of the map's iteration is randomized.
  Instead you can collect the keys of the map, sort them, and then iterate over the sorted keys to access the map.
  This technique provides deterministic results.
  You can also use a Side Effect or an Activity to process the map instead.
- Storing or evaluating the run Id.

One way to produce a non-deterministic error is to use a random number to determine whether to sleep inside the Workflow.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id856238142" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id856238142" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-go/blob/main/backgroundcheck_replay/workflows/backgroundcheck_non_deterministic_code.go">view the source code</a> in the context of the rest of the application code.</div></div>

```go
package workflows

import (
	"math/rand"
	"time"

	"go.temporal.io/sdk/workflow"

	"documentation-samples-go/backgroundcheck_replay/activities"
)


// BackgroundCheckNonDeterministic is an anti-pattern Workflow Definition
func BackgroundCheckNonDeterministic(ctx workflow.Context, param string) (string, error) {
	activityOptions := workflow.ActivityOptions{
		StartToCloseTimeout: 10 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, activityOptions)
	var ssnTraceResult string
	// highlight-start
	// CAUTION, the following code is an anti-pattern showing what NOT to do
	num := rand.Intn(100)
	if num > 50 {
		err := workflow.Sleep(ctx, 10*time.Second)
		if err != nil {
			return "", err
		}
	}
	// highlight-end
	err := workflow.ExecuteActivity(ctx, activities.SSNTraceActivity, param).Get(ctx, &ssnTraceResult)
	if err != nil {
		return "", err
	}
	return ssnTraceResult, nil
}
```
