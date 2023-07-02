const express = require("express");
const multer = require('multer');
const hbjs = require('handbrake-js');
const fs = require('fs');

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

app.post('/upload', upload.single('file'), async (req, res) => {
    const options = {
        input: `${req.file.originalname}`,
        output: 'something.mkv',
        preset: 'Very Fast 1080p30'
    }
    var buf = Buffer.from(req.file.buffer);
    fs.writeFile(`${req.file.originalname}`, buf, { encoding: "binary" }, function (err) {
        if (err) {
            return console.error(err);
        }
    })
    console.log("Data written successfully!");
    const result = await hbjs.run(options);
    console.log(result.stdout);
    console.log('done converting');
    // res.json({req});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});