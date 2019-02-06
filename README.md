# koa-jwt-login-example

This is a quick app to demonstrate how to use koa and koa-jwt to create a secure rest api.

This README assumes you're using yarn. If not, you can substitute npm commands where appropriate.

## Setup

* clone the git repo:

```bash
git clone https://github.com/clintmod/koa-jwt-login-example.git
```

* run `yarn` to install the dependencies
* run `yarn local` to run node via nodemon to auto-reboot node if you edit source files

## Running the tests

You can run the tests with the usual:

```bash
yarn test
```

If you want to develop more tests you can run:

```bash
yarn test-mocha-watch
```

This will start mocha in watch mode.

## Testing the api

* use `curl` to register a new user:

```bash
curl -X POST --data '{"username":"thedude", "password":"abides", "email":"thedude@slacker.com", "name":"Mr. Lebowski"}' http://localhost:9000/public/register
```

* use `curl` to login with that user and get a token:

```bash
curl -X POST -H "Content-Type: application/json" --data '{"username":"thedude", "password":"abides"}' http://localhost:9000/public/login
```

* use `curl` to access the secured `api/v1` route with the token you received in the login step

```bash
curl -X GET -H "Authorization: Bearer INSERT_TOKEN_HERE" http://localhost:9000/sacred
```

## Notes

You'll notice in the `package.json` I'm using a [forked version](https://github.com/clintmod/jwt/tree/v3.2.3-beta) of `koa-jwt`. This is because currently, there's no "documented" way to know when a token expires. I've [opened an issue](https://github.com/koajs/jwt/issues/107) and [sent a pull request](https://github.com/koajs/jwt/pull/108) with what I think is an appropriate fix. When the pull request gets merged and released I'll update the demo with the new version of koa-jwt.

I also hash the password using bcrypt because you should _always_ hash your passwords.
