---
id: inspect-the-new-event-history
title: Inspect the new Event History
sidebar_label: Inspect new Event History
description: After making changes to the code, we must update the Event History JSON file to get tests to pass.
tags:
- tests
- replay
- event history
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-python/blob/main/backgroundcheck_replay/backgroundcheck_dacx.py. -->

After updating your Workflow code to include the logging and Timer, run your tests again.
You should expect to see the `TestReplayWorkflowHistoryFromFile` test fail.
This is because the code we added creates new Events and alters the Event History sequence.

To get this test to pass, we must get an updated Event History JSON file.
[Start a new Workflow](/python/backgroundcheck-boilerplate-start-workflow) and after it is complete [download the Event History as a JSON object](/python/chapter-durable-execution/retrieve-event-history).

:::info Double check Task Queue names

Reminder that this guide jumps between several sample applications using multiple Task Queues.
Make sure you are starting Workflows on the same Task Queue that the Worker is listening to.
And, always make sure that all Workers listening to the same Task Queue are registered with the same Workflows and Activities.

:::

If you inspect the new Event History, you will see two new Events in response to the `asyncio.sleep()` API call which send the [StartTimer Command](/references/commands#starttimer) to the Server:

- `TimerStarted`
- `TimerFired`

However, it is also important to note that you don't see any Events related to logging.
And if you were to remove the Sleep call from the code, there wouldn't be a compatibility issue with the previous code.
This is to highlight that only certain code changes within Workflow code is non-deterministic.
The basic thing to remember is that if the API call causes a [Command](/references/commands#) to create Events in the Workflow History that takes a new path from the existing Event History then it is a non-deterministic change.

This becomes a critical aspect of Workflow development when there are running Workflows that have not yet completed and rely on earlier versions of the code.

Practically, that means non-deterministic changes include but are not limited to the following:

- Adding, removing, reordering an Activity call inside a Workflow Execution
- Switching the Activity Type used in a call to `ExecuteActivity`
- Adding or removing a Timer
- Altering the execution order of Activities or Timers relative to one another

The following are a few examples of changes that do not lead to non-deterministic errors:

- Modifying non-Command generating statements in a Workflow Definition, such as logging statements
- Changing attributes in the `ActivityOptions`
- Modifying code inside of an Activity Definition
