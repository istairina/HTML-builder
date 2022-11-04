const fs = require('fs');
const { readFile } = require('fs/promises')
//const fsPromises = require('fs').promises;

let newFolder = "06-build-page/project-dist";
//let templateContent = fs.createReadStream('06-build-page/template.html', 'utf8');
let templateContentStr = "";
let dataArray = [];
let componentArray = [];
let componentContentStr = "";
let resultArray = [];
//let data;

/*async function content(path) {
    return await readFile(path, 'utf8');
  }

  const text = await content('06-build-page/template.html');
  console.log(text);*/

fs.mkdir(newFolder, { recursive: true }, (err) => {
    if (err) throw err;
});

/*async function readFileFunc (path) {
    then (result) => {
      data = await readFile(path, { encoding: 'utf8' });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }*/

 // templateContentStr = await readFileFunc('06-build-page/template.html');
  //console.log(templateContentStr);




fs.promises.readFile("06-build-page/template.html", 'utf-8')
.then(function(templateContentStr) {
    while (templateContentStr.indexOf("{{") !== -1) {
        let posBegin = templateContentStr.indexOf("{{") + 2;
        let posEnd = templateContentStr.indexOf("}}");
        let tag = templateContentStr.substring(posBegin, posEnd);
        let templateContentStr2 = templateContentStr.slice(posEnd + 2) ;
        let templateContentStr1 = templateContentStr.slice(0, posBegin - 3);
        templateContentStr = templateContentStr1 + templateContentStr2;
        //console.log(templateContentStr);
        dataArray.push(tag);
        dataArray.push(posBegin);
        //dataArray.push(posEnd);
    }
    //console.log(dataArray);
    return templateContentStr;

})
.then (function(templateContentStr) {
    //console.log("next " + templateContentStr);
    //console.log(dataArray.length-2);
    for (let i = (dataArray.length - 2); i >= 0; i = i - 2) {
        //console.log("in cycle " + i + " " + dataArray[i]);
        componentArray.push(fs.promises.readFile(`06-build-page/components/${dataArray[i]}.html`, 'utf8'));
      /*fs.promises.readFile(`06-build-page/components/${dataArray[i]}.html`, 'utf8')
      .then (function(data) {
        //console.log("component " + data);
        componentContentStr = data;
        componentArray.push(data);
      })
      .then (function() {
        console.log("String in fuct " + dataArray[i]);
        let templateContentStr1 = templateContentStr.slice(0, (dataArray[i + 1] - 2));
        //console.log("STR1 " + templateContentStr1);
        let templateContentStr2 = templateContentStr.slice(dataArray[i + 1] - 2);
        //console.log("STR2 " + templateContentStr2);
        templateContentStr = templateContentStr1 + componentContentStr + templateContentStr2;
        return templateContentStr;
      })
      /*.then (function(templateContentStrGot) {
        templateContentStr = templateContentStrGot;
      })*/

      /*.then (function() {
        //templateContentStr = templateContentStr1 + componentContentStr + templateContentStr2;

      })*/
    }
    return templateContentStr;
})
.then (function(templateContentStr){
    Promise.all(componentArray).then((values) => {
        let k = 0;
        for (let i = (dataArray.length - 1); i > 0; i = i - 2) {
            //console.log("k " + templateContentStr);
        let templateContentStr1 = templateContentStr.slice(0, (dataArray[i] - 2));
        //console.log("STR1 " + templateContentStr1);
        let templateContentStr2 = templateContentStr.slice(dataArray[i] - 2);
        //console.log("STR2 " + templateContentStr2);
        templateContentStr = templateContentStr1 + values[k] + templateContentStr2;
        k++;
        resultArray.push(templateContentStr);
        //console.log(resultArray[2]);
        }
        Promise.all(resultArray).then((values) => {
            let lastItem = values.length - 1;
            console.log(values[lastItem]);
            let writeResult = fs.createWriteStream('06-build-page/project-dist/index.html');
            writeResult.write(values[lastItem]);
            //return values[lastItem];
        });
      });

})



/*.then (function(templateContentStr) {
    console.log(templateContentStr);
    Promise.all(resultArray).then((values) => {
        let lastItem = values.length - 1;
        console.log(values[lastItem]);
    });
})


.catch(function(error) {
   console.log(error);
})




/*function getTag(templateContentStr) {
    if (templateContentStr.indexOf("{{") !== -1) {
        let posBegin = templateContentStr.indexOf("{{") + 2;
        let posEnd = templateContentStr.indexOf("}}");
        let tag = templateContentStr.substring(posBegin, posEnd);
        let templateContentStr2 = templateContentStr.slice(posEnd + 2) ;
        let templateContentStr1 = templateContentStr.slice(0, posBegin - 3);
        templateContentStr = templateContentStr1 + templateContentStr2;
        return {
            'posBegin': posBegin,
            'posEnd': posEnd,
            'tag': tag,
            'templateContentStr': templateContentStr
        }
    } else return false;
}

templateContent.on('data', (text) => {
    templateContentStr += text;
    while (templateContentStr.indexOf("{{") !== -1) {
        let templateContentStr2 = templateContentStr.slice(posEnd + 2) ;
        let templateContentStr1 = templateContentStr.slice(0, posBegin - 3);
        templateContentStr = templateContentStr1 + templateContentStr2;
        let componentContent = fs.createReadStream(`06-build-page/components/${tag}.html`, 'utf8');
        let componentContentStr = "";
        componentContent.on('data', (text) => {
            componentContentStr += text;
            templateContentStr = templateContentStr1 + componentContentStr + templateContentStr2;
            //console.log("conponent " + componentContentStr);
            console.log("template " + templateContentStr);
            });
            //componentContent.close();


       console.log(tag);
    }
});

//console.log("template " + templateContentStr);


/*templateContent.on('data', () => {


});*/




//console.log(templateContentStr);