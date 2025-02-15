---
id: backgroundcheck-boilerplate-add-workflow-integration-tests-details
title: Add Workflow Integration tests
sidebar_label: Test Workflow Integration
description: How to test the integration between Workflows and Activities
tags:
- testing
- developer guide
- java sdk
---

<!-- DO NOT EDIT THIS FILE DIRECTLY.
THIS FILE IS GENERATED from https://github.com/temporalio/documentation-samples-java/blob/main/backgroundcheck/src/test/java/backgroundcheckboilerplate/BackgroundCheckBoilerplateWorkflowIntegrationTest.java. -->

This example tests a complete Workflow by invoking the Activities the Workflow
calls. This is, in reality, an integration test. Integration testing is useful
for ensuring the complete success of your entire Workflow. However, note that
any downstream dependencies of the Activities, such as microservice or databases,
must be online for the testing. Furthermore, any mutations the Activity would typically
perform as part of its regular execution will be performed as part of testing.
We recommend either having an entirely separate testing environment for testing
your Workflows, or testing your Workflow and Activity code in isolation, as
detailed in prior sections in this guide.

As for the code, first you register your Workflow with the `TestWorkflowExtension`.
This extension allows you to pass in a `TestWorkflowEnvironment`, `Worker`, and
an instance of your Workflow into your tests. From there you register your Activities
with the Worker, start the test environment, and invoke your Workflow as you would
typically. Then you assert that the results are what you expected.
