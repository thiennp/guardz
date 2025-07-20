# Contributing to guardz

First off, thank you for considering contributing to guardz! It's people like you that make guardz such a great tool.

We welcome contributions of all kinds, including bug reports, feature requests, documentation improvements, and code contributions.

## Ways to Contribute

- **Reporting Bugs:** If you find a bug, please open an issue on GitHub. Include steps to reproduce the bug, the expected behavior, and the actual behavior.
- **Suggesting Enhancements:** If you have an idea for a new feature or an improvement to an existing one, please open an issue on GitHub. Describe your idea clearly and explain why you think it would be valuable.
- **Improving Documentation:** If you notice errors or areas for improvement in the documentation (like the `README.md`), feel free to open an issue or submit a pull request.
- **Submitting Pull Requests:** If you want to contribute code or documentation changes, please follow the steps below.

## Development Setup

1.  **Fork & Clone:** Fork the repository on GitHub and clone your fork locally.
    ```bash
    git clone https://github.com/YOUR_USERNAME/guardz.git
    cd guardz
    ```
2.  **Install Dependencies:** Install the necessary dependencies.
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Branch:** Create a new branch for your changes.
    ```bash
    git checkout -b your-feature-branch-name
    ```

## Making Changes

1.  **Code:** Make your code changes. Ensure you follow the existing code style.
2.  **Tests:** Add or update tests for your changes in the relevant `*.test.ts` file. All contributions should include tests.
3.  **Run Tests:** Ensure all tests pass.
    ```bash
    npm test
    # or
    # yarn test
    ```
4.  **Build:** Ensure the project builds successfully.
    ```bash
    npm run build
    # or
    # yarn build
    ```
5.  **Commit:** Commit your changes with a clear and concise commit message.
    ```bash
    git commit -am "feat: Add some feature"
    # Or "fix: Fix some bug", "docs: Update README", etc.
    ```
6.  **Push:** Push your changes to your fork.
    ```bash
    git push origin your-feature-branch-name
    ```

## Submitting a Pull Request

1.  Go to the original `guardz` repository on GitHub.
2.  Click on "Pull Requests" and then "New pull request".
3.  Choose your fork and the branch containing your changes.
4.  Provide a clear title and description for your pull request, explaining the changes you've made and why. Link to any relevant issues.
5.  Submit the pull request.

We will review your pull request as soon as possible. Thank you for your contribution!

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. (We should add a `CODE_OF_CONDUCT.md` file later if desired).
