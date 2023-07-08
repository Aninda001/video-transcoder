var fs = require('fs');

const createDir = () => {
    if (!fs.existsSync('./incoming')){
        fs.mkdirSync('./incoming');
    }
    
    if (!fs.existsSync('./outgoing')){
        fs.mkdirSync('./outgoing');
    }
}

module.exports = createDir;