const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/backend_test', (req, res) => {
    res.send({ data: 'Backend test is working!' });
});