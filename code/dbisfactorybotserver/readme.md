# dbisfactorybotserver

This project includes a [nodejs](https://nodejs.org/en/) server written with [express](https://expressjs.com/de/) to provide a platform to upload and convert `.bpmn` files.

# Install

You need `node > 8` and `yarn` installed on your machine to run this server.

1. `yarn` to install dependencies
2. `yarn start` to run the server on `localhost:4000/index.html`

# Content

## app.js

Entry point of the application where express gets set-up and the REST-API is defined. 

## public

`index.html` provides a basic html page for uploading and parsiing / converting the files.

## parser 

### parse.js
Converts the uploaded `xml` file to json using the `xml-js` package. The parsed file is saved inside `/parser/converted`.

### createFormat.js
Converts the `json` process in a custom format which is easier to use for the bot. (Removes unused content like bpmn styling). The new format is saved inside `/parser/output/`. 

## common
Includes helper functions. 