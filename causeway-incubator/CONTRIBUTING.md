# Contributing

Welcome! We’re excited to have you here and appreciate your interest in contributing to our project. As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#coc)
- [Development Setup](#setup)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)
- [Commit Message Format](#commit)

## <a name="coc"></a> Code of Conduct

Help us keep CausewayIncubator open and inclusive. Please read and follow our [Code of Conduct](/CODE_OF_CONDUCT.md).

## <a name="setup"></a> Setup and Development

### <a name="prereqs"></a> Prerequisites

Before you can build and run CausewayIncubator, you must install and configure the following on your development machine:

* [Git](https://git-scm.com/) and/or the [**GitHub app**](https://desktop.github.com/) (for Mac and
  Windows);
  [GitHub's Guide to Installing Git](https://help.github.com/articles/set-up-git) is a good source
  of information.

* [Node.js](https://nodejs.org), (version specified in [`.nvmrc`](../.nvmrc)) which is used to run a
  development web server, run tests, and generate distributable files.  
  `.nvmrc` is read by [nvm](https://github.com/nvm-sh/nvm) commands like `nvm install` and `nvm use`.

### <a name="sources"></a> Getting the Sources

Clone the Angular repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. Clone the CausewayIncubator repository

```
# Clone the GitHub repository:
git clone git@github.com:tech4good-lab/causeway-incubator.git

# Go to the directory:
cd causeway-incubator
```

### <a name="npm"></a> Installing NPM Modules

Next, install the JavaScript modules needed to build and test CausewayIncubator:

```shell
# Install the Angular CLI globally
npm install -g @angular/cli

# Install project dependencies (package.json)
npm install
```

### <a name="building"></a> Running the project locally

```shell
# Serve the project locally
ng serve
```

Once you've served the project, the application will be accessible at `http://localhost:4200/`.

### <a name="testing-the-application"></a> Testing the Application

Currently, we have not incorporated testing into our process yet >.< However, we intend to add testing in the future.

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem might already exist, and the discussion might inform you of workarounds readily available. We cannot promise that we will be able to resolve issues quickly.

Given our limited capacity, we will likely only be able to address bugs that can be reproduced. Please provide instructions for how to reproduce it and a recording of the bug. If we don't hear back from you, we may close issues that do not have enough information to be reproduced.

You can file new issues by selecting from our [new issue templates](TBD) and filling out the issue template.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR), consider the following guidelines:

1. Search [GitHub](TBD) for an open or closed PR that relates to your submission. You don't want to duplicate existing efforts.

2. Ensure that an issue describes the problem you're fixing or documents the design for the feature you'd like to add.

3. In your forked repository, make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch develop
   ```

4. Create your patch.

5. Follow our [Coding Rules](#rules).

6. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit). Adherence to these conventions is necessary because release notes are automatically generated from these messages.

   ```shell
   git commit --all
   ```
   Note: The optional commit `--all` command line option will automatically "add" and "rm" edited files.

7. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

8. In GitHub, send a pull request to `causeway-incubator:develop`.

### <a name="review-pr"></a> Reviewing a Pull Request

The team reserves the right not to accept pull requests from community members who haven't been good citizens of the community. Such behavior includes not following the [code of conduct](/CODE_OF_CONDUCT.md) and applies within or outside of our managed channels.

#### Addressing review feedback

If we ask for changes via code reviews, then:

1. Make the required updates to the code.

2. Create a fixup commit and push to your GitHub repository (this will update your Pull Request):

    ```shell
    git commit --all --fixup HEAD
    git push
    ```

    For more info on working with fixup commits, see [here](./contributing-docs/using-fixup-commits.md).

That's it! Thank you for your contribution!

##### <a name="update-commit"></a> Updating the commit message

A reviewer might often suggest changes to a commit message (for example, to add more context for a change or adhere to our [commit message guidelines](#commit)). In order to update the commit message of the last commit on your branch:

1. Check out your branch:

    ```shell
    git checkout my-fix-branch
    ```

2. Amend the last commit and modify the commit message:

    ```shell
    git commit --amend
    ```

3. Push to your GitHub repository:

    ```shell
    git push --force-with-lease
    ```

> NOTE:<br />
> If you need to update the commit message of an earlier commit, you can use `git rebase` in interactive mode. See the [git docs](https://git-scm.com/docs/git-rebase#_interactive_mode) for more details.

#### <a name="pr-merge"></a> After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the `develop` (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the `develop` branch:

    ```shell
    git checkout develop -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your local `develop` with the latest upstream version:

    ```shell
    git pull --ff upstream develop
    ```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

<!-- * All features or bug fixes **must be tested** by one or more specs (unit-tests).-->
* All public API methods **must be documented**.
* We follow [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html), but wrap all code at **100 characters**.
* More details on our coding standards can be found in our [Coding Standards](contributing-docs/coding-standards.md) document. Please follow these rules to maintain code quality.

## <a name="commit"></a> Commit Message Format

We have very precise rules over how our Git commit messages must be formatted using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0). This format leads to **easier-to-read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs". When the body is present, it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.

#### <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope:public|admin|core|main|first-time|shared|...
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory; the `(<scope>)` field is optional.

##### Type

Will most commonly be either `feat` or `fix`, but can be drawn from any of the below following angular practices:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation-only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

##### Scope

The scope will most commonly corresponds to one of the folders directly underneath app (i.e. what used to correspond to a module before standalone components). For example:

- **public**
- **admin**
- **core**
- **main**
- **first-time**
- **shared**

There are currently a few exceptions to this rule:

- **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
- **changelog** for updating the release notes in CHANGELOG.md
- none/empty string: useful for style, test and refactor changes that are done across all packages (e.g. style: add missing semicolons)

##### Summary

The summary contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### <a name="commit-body"></a>Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making this change. You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

#### <a name="commit-footer"></a>Commit Message Footer

The footer can contain information about breaking changes and is also the place to reference GitHub issues and other PRs that this commit closes or is related to. For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fix #<issue number>, Close #<pr number>
```

Breaking Change section should start with the phrase `BREAKING CHANGE: ` followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

### Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.
