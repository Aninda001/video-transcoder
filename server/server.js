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
    const fileName = Date.now();
    var buf = Buffer.from(req.file.buffer);
    fs.writeFile(`incoming\\${req.file.originalname}`, buf, { encoding: "binary" }, function (err) {
        if (err) {
            return console.error(err);
        }
    })
    console.log("Data written successfully!");

    const options = {
        input: `incoming\\${req.file.originalname}`,
        output: `outgoing\\${fileName}.mkv`,
        preset: 'Very Fast 2160p60 4K HEVC'
    }

    console.log('Start converting');
    const result = await hbjs.run(options);
    console.log(result.stdout);
    console.log('Done converting');

    fs.unlink(`incoming\\${req.file.originalname}`, (err) => {
        if (err) return console.error(err);
        console.log('Successfully deleted');
    });

    res.json({ path: options.output });
});

app.get('/download/outgoing/:path', (req,res) => {
    res.download(`outgoing/${req.params.path}`);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});