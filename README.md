# giaa: Google Indexing Api Automator
Google Indexing API automator

## Installation

#### Linux or Mac OSX
- node installation:
  - Linux via package manager: https://nodejs.org/en/download/package-manager/
  - MacOS: https://nodejs.org/en/download/
- mongodb installation: https://docs.mongodb.com/manual/administration/install-on-linux/
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
- Create config/cids directory
- Customize config/app.js options:
  - database: mongodb connection options,
  - api_daily_quota: indexing api daily quota,
  - cids_dir: cids certificates path,
  - basic_auth: if true activate http basic auth with basic_auth_user and basic_auth_pass credentials,
  - basic_auth_user: http basic auth username,
  - basic_auth_pass: http basic auth password
- Download one or more public/private key pair file/files and copy it/them into config/cids
- Restart app
- Go to http://localhost:3000/config
- Pair your GSC property/ies to specific public/private key pair file

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
