const express = require('express');
const bodyParser = require('body-parser');
const {authorize, readAppData, writeAppData, readFile, writeFile, removeFile, logError} = require('./api');
const app = express();
// const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 5000;
const jsonParser = bodyParser.json()

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/backend_test', (req, res) => {
    console.log('back test');
    res.send({ data: 'Backend test is working!' });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let token;
app.post('/auth', jsonParser, (req, res) => {
    // verify token/req.body has what it needs {"access_token", "refresh_token", "scope", "token_type", "Bearer", "expiry_date"
    authorize(req.body).then(oAuth2Client => {
        token = oAuth2Client;
        // setup refresh 
        if (token) {
            res.send('authorized')
        }
        else {
            res.send('signout')
        }
    }); 
});

app.get('/appdata', async (req, res) => {
    // get and return appdata
    const data = await readAppData(token);
    res.send(data);
});

app.put('/appdata', jsonParser, function (req, res) {
    // write new appdata
    const written = await writeAppData(token, req.body)
    res.send(written);
});

app.get('/file', jsonParser, (req, res) => {
    // get and return file 
    
});

app.post('/file', jsonParser, function (req, res) {
    // upload a file
    
    res.send('Got a PUT request at /user')
});

app.delete('/file', jsonParser, function (req, res) {
    // delete file
    res.send('Got a DELETE request at /user')
  })