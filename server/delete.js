const fs = require('fs')

const delFile = () => {
    fs.readdir('outgoing/', function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
        }
        files.forEach(function (file, index) {
            const ext = file.lastIndexOf('.');
            if(parseInt(file.slice(0,ext)) < Date.now() - 1000*60*1){
                fs.unlink(`outgoing\\${file}`, (err) => {
                    if (err) return console.error(err);
                    console.log('Successfully deleted old file');
                });
            }
        })
    })
}

module.exports = delFile;