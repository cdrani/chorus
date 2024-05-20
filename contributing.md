# Contributing

:tada: First off, thanks for taking the time to contribute! :tada:

The following is a set of guidelines for contributing to Chorus. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

This project and everyone participating in it are governed by the [Code of Conduct](/code_of_conduct.md). By participating, you are expected to uphold this code.

## How can I contribute?

1. Star this repo. It's quick and aids in discoverability! :stars:
2. [Reporting Bugs](#reporting-bugs). Draw attention to quirks or misbehaviours in functionality. If something seems off or doesn't work like it used, please report it so it can be fixed for all users.
3. [Suggest Enhancements](#suggesting-enhancements). Feature missing that you would like introduced? File a suggestion and you might get your wish. Your wish could saves other users' wishes. There are only a finite ammount of Djinns in the world! 🪄 🧞
4. [CodeBase Contribution](#codebase-contribution-). You want to add new features, fix bugs, update documentation, designs, assets such as videos/images, etc? I heard a resounding YES! No backsies. 😄

Any form of contribution (except for stars), as long as they are unique, will be recognized by having the user's github profile included in the all-contributors list and in the README [contributors wall](./README.md#%EF%B8%8F-contributors-%EF%B8%8F).

<details>
<summary>
  
## Reporting Bugs
</summary>

---

This section guides you through submitting a bug report for Chorus. Following these guidelines helps maintainers, and the community understand your report :pencil:, reproduce the behavior :computer:, and find related reports :mag_right:.

When you are creating a bug report, please include as much detail as possible.

#### How Do I Submit a Bug Report?

Bugs are tracked as [GitHub issues](https://github.com/cdrani/chorus/issues/).

Explain the problem and include additional details to help reproduce the problem:

-   **Use a clear and descriptive title** for the issue to identify the problem.
-   **Describe the exact steps which reproduce the problem** in as many details as possible. Don't just say what you did, but explain how you did it.
-   **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
-   **Explain which behavior you expected to see instead and why.**

Include details about your environment.

</details>

<details>
<summary>
  
## Suggesting Enhancements
</summary>

---

This section guides you through submitting an enhancement suggestion for Chorus. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

When you are creating an enhancement suggestion, please include as much detail as possible.

#### How Do I Submit an Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/cdrani/chorus/issues/).

Create an issue on that repository and provide the following information:

-   **Use a clear and descriptive title** for the issue to identify the suggestion.
-   **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
-   **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
-   **Explain why this enhancement would be useful** to most users.

</details>

<details>
<summary>
  
## CodeBase Contribution [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
</summary>

---

Please feel free to contribute to this open source project. First timers are more than welcome. Unsure where to begin contributing to Chorus? You can start by looking through these `good-first-issue` and `help-wanted` issues:

-   [Good first issue](https://github.com/cdrani/chorus/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) - issues which should only require a small amount of code and/or effort. Extra help readily available, especially for first time contributors to codebase.
-   [Help wanted](https://github.com/cdrani/chorus/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) - issues which should be a bit more involved than `Good first issue` issues, but guidance will be provided all the same.

Take a look at the open issues under the [issues tab](https://github.com/cdrani/chorus/issues). If you identify a bug, or would like to implement a feature that isn't posted under the issues, please feel free to submit a new issue, for which steps are outlined above. Also, if you see anything that needs to be updated in the README file, you're more than welcome to update it. **For issues you want to work on please assign yourself to it, or just mention in a comment under the issue that you have claimed it.**

### Getting Started

1. Fork the project.
2. Clone your fork.
3. Make sure you are in the right directory: `cd chorus`.
4. Add an `upstream` remote for keeping your local repository up-to-date: `git remote add upstream git@github.com:cdrani/chorus.git`
5. [Install pnpm](https://pnpm.io/installation)
6. Run `pnpm install` to install the project dependencies.

### Local Development

#### Chromium-based Browser (brave, edge, chrome, etc)

1. Run `pnpm watch` to start your dev environment. This will create a `dist` folder that will be watched for changes to reload the extension.
2. Open browser tab to `[browser]://extensions`. For ex. `chrome://extensions`, `brave://extensions`, `edge://extensions`. Most chromium browsers will have a similar pattern.
3. Toggle `Developer mode` switch ON.
4. Click `Load unpacked` (or similar) button.
5. Find and select the `dist` folder.
6. Open `open.spotify.com` tab. Pin tab for easy access.
7. Hack!

#### FireFox

Possible, but I suggest using a chromium-based browser. However...

1. Run `pnpm watch` to start your dev environment. This will create a `dist` folder that will be watched for changes to reload the extension.
2. In the dist folder, make this change:

```diff
-  "background": {
-    "type": "module",
-    "service_worker": "background.js"
-  }
+  "background": {
+    "type": "module",
+    "scripts": [
+      "background.js"
+    ]
+  },
+  "browser_specific_settings": {
+    "gecko": {
+      "id": "chorus@cdrani.dev",
+      "strict_min_version": "112.0"
+    }
+  }
```

3. Open browser tab to `about:debugging`.
4. Click `This Firefox` from left panel.
5. Click `Load temporary Add-on` button.
6. Select `manifest.json` from `dist` folder.
7. Accept permissions. Pin tab for easy access.
8. Hack!

### Creating A PR

1. Make sure you are on the `develop` branch, and you have pulled the latest changes.

    > `git checkout develop && git pull upstream develop`

2. Install any new dependencies: `pnpm install`.

3. Create a new branch off of the `develop` branch.

    > `git checkout -b [NEW BRANCH NAME]`

    > **Branch naming conventions:** `fix/[BRANCH]` for bug fixes, `feat/[BRANCH]` for new features, `doc/[BRANCH]` for changes to documents. The `[BRANCH]` portion should be kebab case. For example, if you want to update the README.md file, your branch could be called `doc/update-readme`.

4. Make changes and fix any warnings and/or errors that arise in the console.
5. Commit your changes: `git add . && git commit -m [YOUR COMMIT MESSAGE]`.

    > The subject of a commit message (the first line) should be 72 characters or less. If you need more room for a longer explanation of your changes, you can add a blank line below the subject and write a commit body. The commit message should be in present-imperative tense ("update README.md" rather than "updates" or "updated").

6. Push your branch to your fork: `git push -u origin [BRANCH NAME]`.
7. Open a new PR against the `develop` branch from your fork using the GitHub user interface.
 </details>
