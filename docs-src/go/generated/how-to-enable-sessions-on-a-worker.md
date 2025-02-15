---
id: how-to-enable-sessions-on-a-worker
title: How to enable Sessions on a Worker
sidebar_label: Enable Sessions
description: Set EnableSessionWorker to true in the Worker options.
tags:
- go sdk
- code sample
- session
- worker
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-go/blob/main/sessions/worker/main_dacx.go. -->

Set `EnableSessionWorker` to `true` in the Worker options.

<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-id467621428" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-id467621428" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="https://github.com/temporalio/documentation-samples-go/blob/main/sessions/worker/main_dacx.go">view the source code</a> in the context of the rest of the application code.</div></div>

```go
// ...
func main() {
// ...
	// Enable Sessions for this Worker.
	workerOptions := worker.Options{
		EnableSessionWorker: true,
// ...
	}
	w := worker.New(temporalClient, "fileprocessing", workerOptions)
	w.RegisterWorkflow(sessions.SomeFileProcessingWorkflow)
	w.RegisterActivity(&sessions.FileActivities{})
	err = w.Run(worker.InterruptCh())
// ...
}
```
