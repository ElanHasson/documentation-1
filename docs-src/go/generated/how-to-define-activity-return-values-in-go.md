---
id: how-to-define-activity-return-values-in-go
title: How to define Activity return values in Go
sidebar_label: Activity return values
description: A Go-based Activity Definition can return either just an `error` or a `customValue, error` combination.
tags:
- go sdk
- code sample
- activity
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-go/blob/main/yourapp/your_activity_definition_dacx.go. -->

A Go-based Activity Definition can return either just an `error` or a `customValue, error` combination (same as a Workflow Definition).
You may wish to use a `struct` type to hold all custom values, just keep in mind they must all be serializable.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id-1778957100" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id-1778957100" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-go/blob/main/yourapp/your_activity_definition_dacx.go">view the source code</a> in the context of the rest of the application code.</div></div>

```go
// YourActivityResultObject is the struct returned from your Activity.
// Use a struct so that you can return multiple values of different types.
// Additionally, your function signature remains compatible if the fields change.
type YourActivityResultObject struct {
	ResultFieldX string
	ResultFieldY int
}
// ...
func (a *YourActivityObject) YourActivityDefinition(ctx context.Context, param YourActivityParam) (*YourActivityResultObject, error) {
// ...
	result := &YourActivityResultObject{
		ResultFieldX: "Success",
		ResultFieldY: 1,
	}
	// Return the results back to the Workflow Execution.
	// The results persist within the Event History of the Workflow Execution.
	return result, nil
}
```
