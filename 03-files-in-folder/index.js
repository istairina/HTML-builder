const fs = require('fs');

let folder = "03-files-in-folder/secret-folder";

function getSize (path, name, ext) {
  path = `${folder}/${path}`;
  let sizeF = 0;

  fs.stat(path, (err, stats) => {
    if (err) {
      console.log(err);
    } else {
        sizeF = (Math.round((stats['size'] / 1024) * 100)) / 100;
        console.log(`${name} - ${ext} - ${sizeF}Kb`);
      }
  });

}

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
  if (err) console.log(err);

  for (i = 0; i < files.length; i++) {
    if (files[i].isFile()) {
      let nameF = files[i]['name'].split('.');
      let nameFExt = nameF[nameF.length - 1];
      getSize(files[i]['name'], nameF[0], nameFExt);
    }
  }
});