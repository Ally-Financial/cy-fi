# cypress-code-generator

chrome plugin for cypress code generation

## Getting started

This is chrome extension that can be installed as unpacked extension for development purposes or published version can be accessed at chrome store

## As a developer
 Navigate to chrome://extensions/ and click the "Load unpacked extension..." button. Navigate to and select this directory. You should then see an extension and see the app when you open a new tab.


## Published version

Its available as Cy-Fi on chrome app store

## Features

Generates Cypress Code by recording user actions on a web page.

Cypress Code Generator that simplifies automation testing by recording your actions and assertions and generating Cypress code for you using testing library methods. This extension allows you to easily record your interactions with web pages and then automatically generates Cypress code that can be used to repeat those actions during automated testing. With this extension, you can quickly and easily create comprehensive test suites that cover all of the functionality of your web application, without the need for manual coding. Try it out today and see the difference it can make in your automation testing workflow.

 What are the features?

* Uses cypress commands from cypress/testing-library for identifying HTML elements to follow best practices in automation.
* User-friendly interface and easy navigation.
* Records clicks, typing, web navigations and form submissions.
* Automatically generates Cypress code from recorded actions.
* A code editor to edit, delete or reset the actions you performed.
* Pause and resume recording.
* Copy the generated code to your clipboard.
* Find the best selector of an element by inspecting it.
* Provides different cypress commands to play with.
* Let user pick the priority order to detect locators
* Automatically decides the assertion based on elements interacted, makes asserions simple

## How to use
* Open the extension and click on 'Play' button to begin recording actions.
* Check your actions by opening the popup at any time during recording
* Click the 'Stop' button to stop recording. 
* Click the 'Resume' button to resume recording. 
* You can also reset, or copy the generated code to your clipboard.
* Click on 'Inspect' button to start inspecting an element.
    - Click on an HTML element to get it's cy selector.
    - Press 'ESCAPE' key to continue the inspection.
* You can rearrange different cypress commands in the settings tab.
* You can records assertions applicable to elements you are interacting with

## Upcoming
* Ability to use cy.intercept

