const express = require("express");
const multer = require('multer');
const hbjs = require('handbrake-js');
const fs = require('fs');
const del = require('./delete');

require('dotenv').config();

const port = 8000;
const format = ['mp4', 'm4v', 'mov', 'mpg', 'mpeg', 'avi', 'mkv', 'wmv', 'flv', 'webm', 'vob', 'evo', 'mts', 'm2ts'];


const app = express();
const upload = multer();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/upload', upload.single('file'), async (req, res, next) => {

    del();
    try {
        const ext = req.file.originalname.lastIndexOf('.');
        if (!format.includes(req.file.originalname.slice(ext + 1).toLowerCase())) {
            throw new Error('Invalid file format.')
        }
    } catch (err) {
        next(err);
    }

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
        output: `outgoing\\${fileName}.${req.body.codec}`,
        preset: 'Very Fast 2160p60 4K AV1'
    }

    console.log('Start converting');
    const result = await hbjs.run(options);
    console.log(result.stderr);
    console.log('Done converting');

    fs.unlink(`incoming\\${req.file.originalname}`, (err) => {
        if (err) return console.error(err);
        console.log('Successfully deleted');
    });

    res.json({ path: options.output });
});

app.get('/download/outgoing/:path', (req, res) => {
    res.download(`${__dirname}\\outgoing\\${req.params.path}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(process.env.PORT, () => {
    console.log(`Listening....`);
});