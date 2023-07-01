const express = require("express");
const multer = require('multer');

const port = 8000;

const app = express();
const upload = multer();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

app.post('/upload',  (req, res) => {
    // res.send({msg : req});
    console.log(req);
    // res.json({req});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})