const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

// load the environment variable with our keys
const keysEnvVar = process.env.CREDS;
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);

async function authorize(token) {
  try {
    const {client_secret, client_id, redirect_uris} = keys;
    const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (e) {
    return e
  }
}

async function readAppData(auth) {
  try {
    const drive = google.drive({version: 'v3', auth});
    const data = await drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    })
    return data
  } catch (e) {
    return e
  }
}

async function writeAppData(auth, data) {
  try {
    const drive = google.drive({version: 'v3', auth}); 
    const fileMetadata = {
      'name': 'appdata.json',
      'parents': ['appDataFolder']
    };
    const media = {
      mimeType: 'application/json',
      body: data
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    return true;
  } catch (e) {
    return e
  }
}

async function readFile(auth, fileId) {
  /*const drive = google.drive({version: 'v3', auth});
  const dest = fs.createWriteStream('/tmp/photo.jpg');
  drive.files.get({
  fileId: fileId,
  alt: 'media'
  })
      .on('end', function () {
      console.log('Done');
      })
      .on('error', function (err) {
      console.log('Error during download', err);
      })
      .pipe(dest);
  res.send('Got a POST request') */
}

function writeFile() {
/*  header example: 
    POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable HTTP/1.1
    Authorization: Bearer [YOUR_AUTH_TOKEN]
    Content-Length: 38
    Content-Type: application/json; charset=UTF-8
    X-Upload-Content-Type: image/jpeg
    X-Upload-Content-Length: 2000000

    {
    "name": "myObject"
    }

    Handle errors: 
    Resume or retry uploads that fail due to connection interruptions or any 5xx errors
    Resume or retry uploads that fail due to 403 rate limit errors.
    Use an exponential backoff strategy if any 403 or 5xx server error is returned when upload requests retry or resend. These errors can occur if a server gets overloaded. Exponential backoff can help alleviate these kinds of problems when there is a high volume of requests or heavy network traffic.
    (Resumable uploads only) Restart uploads if a 404 Not Found error is received after it resumes or uploads a chunk. This indicates the upload session has expired and must be restarted from the start. Upload sessions expire after 1 week of inactivity.
*/
}

function removeFile(auth, id) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.delete({id})
}

function logError(e) {
  console.error(e);
}

module.exports = {authorize, readAppData, writeAppData, readFile, writeFile, removeFile, logError}