# Contributing to ModSaber
If you wish to contribute to the ModSaber codebase, feel free to fork the repository and submit a pull request. We use ESLint to enforce a consistent coding style, so having that set up in your editor of choice is a great boon to your development process.

## Submit bug reports or feature requests
Just use the GitHub issue tracker to submit your bug reports and feature requests. When submitting, please use the [issue templates](https://github.com/lolPants/ModSaber/issues/new/choose).

## Development Prerequisites
- Node.js (>=8.0.0) and `npm`
- MongoDB server running locally on port `27017`
- Redis server running locally on port `6379` **[OPTIONAL]**

## Setup
1. Fork & clone the repository, and make sure you're on the master branch
2. Copy `example.env` to `server/.env` and fill out the relevant keys
3. Run `npm install` in the `client` and the `server` directories
4. Write some code!
5. Document all notable changes in the `[Unreleased]` section of the [changelog](https://github.com/lolPants/ModSaber/blob/master/CHANGELOG.md)
6. `npm run test` to run ESLint and check code style
7. [Submit a pull request](https://github.com/lolPants/ModSaber/compare)
