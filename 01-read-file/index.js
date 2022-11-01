const fs = require('fs');
const textFile = fs.createReadStream('01-read-file/text.txt', 'utf-8');

let textOut = '';

textFile.on('data', text => textOut += text);
textFile.on('data', () => console.log(textOut));
textFile.on('error', error => console.log('Error', error.message));