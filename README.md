# giaa: Google Indexing Api Automator
Google Indexing API Automator provides a convenient UI to [Google Indexing API](https://developers.google.com/search/apis/indexing-api/v3/quickstart).
Giia is an open source application based on Node.js + MongoDB; it could be used locally or it could be installed on a server.

- It allows you to easily interface with the Google Indexing API and stores all the requests made.
- It allows you to manage multiple GSC/Api account properties simultaneously and request batch indexing.
- Automates the authorization token request process.

It allows you to optimize the limit of daily requests, with preventive checks, such as:

- requested url domain not configured in GSC.
- url for a URL_UPDATED request that returns a 404/410.
- url for a URL_REMOVED request that returns a 200.
- wrong url.
- redirects following.
- storing the notification time of the request makes the urlNotifications requests redundant.

## Installation

#### Linux or Mac OSX
- node installation:
  - Linux via package manager: https://nodejs.org/en/download/package-manager/
  - MacOS: https://nodejs.org/en/download/
- mongodb installation:
  - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/
  - MacOs: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- npm install within project dir:
```sh
$ npm install
```

#### Windows
- node installation: https://nodejs.org/en/download/
- mongodb installation: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mdb-edition
- npm install within project dir:
```sh
$ npm install
```

## Giaa Startup

#### Linux or Mac OSX
Within project dir:
```sh
$ npm start
```

#### Windows
Within project dir:
```sh
$ npm start
```

## Giaa basic configuration
- Complete the Indexing API prerequisites: https://developers.google.com/search/apis/indexing-api/v3/prereqs
- At the end of the previous process you should have downloaded one or more public/private key pair file/files in .json format: copy it/them into config/cids
- Customize config/app.js options:
  - database: mongodb connection options,
  - api_daily_quota: indexing api daily quota,
  - cids_dir: cids certificates path,
  - basic_auth: if true activate http basic auth with basic_auth_user and basic_auth_pass credentials,
  - basic_auth_user: http basic auth username,
  - basic_auth_pass: http basic auth password
- Restart app
- Go to http://localhost:3000/config
- Pair your GSC property/ies to your previously downloaded public/private key pair file:

![](https://raw.githubusercontent.com/m3m3nto/giaa/master/public/img/giaa.png)

## Models
- service_account
  - cif: client id file name
  - domains:
- urls
  - location: { type: String },
  - type: { type: String },
  - response_status_code: { type: String },
  - response_status_message: { type: String },
  - notifytime: { type: Date },
  - status: { type: String },
  - updatedat: { type: Date }


---
Main Sponsor: [Altura Labs](http://www.alturalabs.com)
