const fs = require('fs');
const { readFile } = require('fs/promises');
const readline = require('readline');
const path = require('path');
const fsPromises = require('fs').promises;

let newFolder = "06-build-page/project-dist";
let styleFolder = '06-build-page/styles';
let styleDist = '06-build-page/project-dist/style.css';
let assetsFolder = "06-build-page/assets";
let assetsDist = "06-build-page/project-dist/assets";

let dataArray = [];
let componentArray = [];
let resultArray = [];

//create destination folder for build
fs.mkdir(newFolder, { recursive: true }, (err) => {
    if (err) throw err;
});

//creatr html-file with all components
fs.promises.readFile("06-build-page/template.html", 'utf-8')
.then(function(templateContentStr) {
    while (templateContentStr.indexOf("{{") !== -1) {
        let posBegin = templateContentStr.indexOf("{{") + 2;
        let posEnd = templateContentStr.indexOf("}}");
        let tag = templateContentStr.substring(posBegin, posEnd);
        let templateContentStr2 = templateContentStr.slice(posEnd + 2) ;
        let templateContentStr1 = templateContentStr.slice(0, posBegin - 2);
        templateContentStr = templateContentStr1 + templateContentStr2;
        dataArray.push(tag);
        dataArray.push(posBegin);
    }
    return templateContentStr;

})
.then (function(templateContentStr) {
    for (let i = (dataArray.length - 2); i >= 0; i = i - 2) {
        componentArray.push(fs.promises.readFile(`06-build-page/components/${dataArray[i]}.html`, 'utf8'));

    }
    return templateContentStr;
})
.then (function(templateContentStr){
    Promise.all(componentArray).then((values) => {
        let k = 0;
        for (let i = (dataArray.length - 1); i > 0; i = i - 2) {
        let templateContentStr1 = templateContentStr.slice(0, (dataArray[i] - 2));
        let templateContentStr2 = templateContentStr.slice(dataArray[i] - 2);
        templateContentStr = templateContentStr1 + values[k] + templateContentStr2;
        k++;
        resultArray.push(templateContentStr);
        }
        Promise.all(resultArray).then((values) => {
            let lastItem = values.length - 1;
            let writeResult = fs.createWriteStream('06-build-page/project-dist/index.html');
            writeResult.write(values[lastItem]);
        });
      });

})

//create css file with all styles
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


fs.readdir(styleFolder, {withFileTypes: true}, (err, file) => {
  if (err) console.log(err);
  let writeStr = fs.createWriteStream(styleDist);

  for (i = 0; i < file.length; i++) {
    if (path.extname(file[i]['name']) == '.css' && file[i].isFile()) {
        fs.createReadStream(`${styleFolder}/${file[i]['name']}`, 'utf-8').pipe(writeStr);
    }
  }
});

rl.close();


//create copy of assets folder

function copyFolder(assetsFolder, assetsDist) {
  fs.readdir(assetsFolder, {withFileTypes: true}, (err, file) => {
    if (err) console.log(err);
  for (let i = 0; i < file.length; i++) {
    if (file[i].isFile()) {
      fs.createReadStream(`${assetsFolder}/${file[i]['name']}`).pipe(fs.createWriteStream(`${assetsDist}/${file[i]['name']}`));
    } else {
      let assetsInsideFolder = `${assetsFolder}/${file[i]['name']}`;
      let assetsInsideDist = `${assetsDist}/${file[i]['name']}`;
      fs.mkdir(assetsInsideDist, { recursive: true }, (err) => {
        if (err) throw err;
      });

      copyFolder(`${assetsFolder}/${file[i]['name']}`, assetsInsideDist);
      }
  }
})
}


fs.promises.rm(assetsDist, {recursive: true, force: true})
.then (function() {
  fs.mkdir(assetsDist, { recursive: true }, (err) => {
    //console.log("delete");
    if (err) throw err;
  });
})


.then (function() {
  copyFolder(assetsFolder, assetsDist);
})
