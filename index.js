require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create express app
const app = express();

// Allow File Size
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*'
}));

// listen for requests
var port = process.env.PORT || 3012;
app.listen(port, () => {
    console.log(`Hi!!! Server is listening on port ${port}`);
});