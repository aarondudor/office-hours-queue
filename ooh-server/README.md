# Office Hour Hacks Server

This is the repo for the REST API server for Office Hour Hacks. For frontend repo, see 
[here](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2023/l1_06/ooh-app).

## Getting Started

1. Install packages with Yarn

```shell
yarn
```

2. Prepare hooks

```shell
yarn prepare
```

3. Run development server

```shell
yarn start
```

## Contributing

1. Create a new local branch.

```shell
git checkout -b <new-branch>
```

2. Once you are done writing code, pull and merge changes from remote `main` into your local branch.
Resolve any conflicts, if there are any.

```shell
git fetch
git pull origin main
```

3. Commit and push your changes.

```shell
git add .
git commit -m <message>
git push -u origin <branch-name>
```

### Create a Merge Request on GitLab.

1. Go to the repo's merge request tab [here](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2023/l1_06/ooh-server/-/merge_requests).
2. Select **New merge request**.
3. Select the source branch as **your working branch**.
4. Select the target branch as the `main` branch.
5. Wait for approval on your merge request.

The pre-commit hook makes sure your pushed code conforms to ESLint rules. If there are errors, 
your commit fails. View the ESLint log to see the errors and go fix them! Once all errors are 
eliminated, you will be able to commit, and it will automatically lint and format your staged files.

## Building

Compile the project for deployment.

```shell
yarn build
```
