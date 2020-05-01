# Wavy :rocket:
A file-sorting app that takes dates from metadata to automatically produce a visual timeline.

## Overview
**Wavy** is a break away from the dated and boring file storage sytstem. The app uses a timestamp algorithm to store and retrieve files, delivering a fast and efficient way to sort through records. A User can upload or drag-in file(s) on their timeline, and the app organizes the files into a visually appealing series of events. Wavy has a 'share' feature that enables sharing of files amongst friends.

[Checkout the demo](#link)


## Tech stacks 

* React v16.13.1
* Styled Components v5.0.1

## Setup :hammer_and_wrench:

### Clone repo and install dependencies
```
  $ git clone https://github.com/chingu-voyages/v18-geckos-team-02
  $ cd v18-geckos-team-02
  $ npm install 
  $ cd client
  $ npm install 
```

### Dev start
#### Google Drive API credentials 
- Visit [Google's developer console](https://console.cloud.google.com/) 
- Navigation Menu (hamburger top left) --> APIs & Services --> Library --> Activate the Google drive API 
- Create credentials 
- Download credentials.json 
- Make .env file in project root and paste in your credentials.json within CREDS="" (should look like below but remove \n newlines so it's JSON compliant)
```
CREDS="{
  "type":"service_account",
  "project_id":<>,
  "private_key_id":<>,
  "private_key":<>,
  "client_email":<>,
  "client_id":<>,
  "auth_uri":"https://accounts.google.com/o/oauth2/auth",
  "token_uri":"https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url":<>,
  "redirect_uris":["http://localhost:3000/oauthcallback"]}"
```
#### Start server
In project root run:
``` 
$ npm start
 ```
#### Start Client
In another terminal cd into v18-geckos-team-02/client folder run:
``` 
$ npm start 
```

## Contributors :sparkler:
This project is designed and developed by the [Chingu](https://www.chingu.io/) Voyage-18 geckos team - [Lily](https://github.com/lily-law), [JonHill](https://github.com/jondhill333) and [krebeDev](https://github.com/krebeDev)


## Contributing 
Thanks for your interest in contributing! There are many ways to contribute to this project. Get [started here](CONTRIBUTING.md).


## License 
This project is open source and available under the [MIT License](LICENSE.md).