const fs = require('fs');
const readline = require('readline');
const path = require('path')

let styleFolder = '05-merge-styles/styles';
let fileDist = '05-merge-styles/project-dist/bundle.css';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


fs.readdir(styleFolder, {withFileTypes: true}, (err, file) => {
  if (err) console.log(err);
  let writeStr = fs.createWriteStream(fileDist);

  for (i = 0; i < file.length; i++) {
    if (path.extname(file[i]['name']) == '.css' && file[i].isFile()) {
        fs.createReadStream(`${styleFolder}/${file[i]['name']}`, 'utf-8').pipe(writeStr);
    }
  }
});

rl.close();