
# Contributing 
We love community input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Data Classification Disclaimer
As this source code will be widely disseminated please ensure that great care is take to avoid accidental inclusion of Confidential data elements.  Secrets referenced from code should be tokenized for substitution during build / deploy.

## Code of Conduct
Ally LEAD principles (particularly Act with Professionalism) and our Diversity and Inclusion ideals already compose a strong Code of Conduct for our community.  Please be mindful submitted Pull Requests will receive scrutiny which may result in constructive feedback.  Keep an open mind and be objective in receiving and providing feedback.  

Excellent open source community references also exist.
- [CNCF Community Code of Conduct v1.0](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) 
- [Contributor Covenant](https://www.contributor-covenant.org/)


## Development Process
We use BitBucket to host code as well as accept pull requests.

### We Use [Git Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Git Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Report bugs using Jira [Issues](https://jira.int.ally.com/projects/ISOURCE)
Inner Source projects should use Jira issues to track. Report a bug by creating a new issue and include a label for the Inner Source project.

### Jira Issue Conventions
When creating a Jira Issue please include a label with the exact name of the repo.

### Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.  Includes sample code that *anyone* with a base setup can run to reproduce what I was seeing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

Thorough bug reports are more likely to receive attention and resolution.

## Issue SLAs
Discuss expectations of timelines for issue triage and disposition.

## Use a Consistent Coding Style

If you need to add new Java classes or methods to implement new steps please follow common Java rules:

When choosing a name, use full words instead of cryptic abbreviations. Doing so will make your code easier to read and understand. In many cases it will also make your code self-documenting. 

**Classes:** 

- Should be nouns, in mixed case with the first letter capitalized and the first letter of each next internal word capitalized. 
- No spaces allowed. Separate by underscores (“_”). 
- Dollar sign ($) not allowed
- Equals sign (=) not allowed
- The name should not start with special characters like & (ampersand), $ (dollar), _ (underscore).

Example: StepsDefinition.java

**Methods**

- Should be verbs, in mixed case with the first letter lowercase and with the first letter of each internal word capitalised.
- No spaces allowed. Separate by underscores (“_”). 
- Dollar sign ($) not allowed
- Equals sign (=) not allowed
- The name should not start with special characters like & (ampersand), $ (dollar), _ (underscore).

Example:  getContentType ()

**Variables :** Variable names should be short yet meaningful.

- Should not start with underscore(‘_’) or dollar sign ‘$’ characters.
- Should be mnemonic i.e, designed to indicate to the casual observer the intent of its use.
- One-character variable names should be avoided except for temporary variables.
- Common names for temporary variables are i, j, k, m, and n for integers; c, d, and e for characters.
- No spaces allowed. Separate by underscores (“_”). 
- Dollar sign ($) not allowed
- Equals sign (=) not allowed

## Test Harness
- Discuss your test harness approach. 

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)