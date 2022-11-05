const fs = require('fs');

let folder = '04-copy-directory/files';
let folderDist = '04-copy-directory/files-copy';

fs.mkdir(folderDist, { recursive: true }, (err) => {
    if (err) throw err;
  });

/*fs.readdir(folderDist, (err, file) => {
  if (err) console.log(err);
  for (i = 0; i < file.length; i++) {
    fs.unlink(`${folderDist}/${file[i]}`, (err) => {
      if (err) console.log(err);
    });
  }
});*/

fs.promises.readdir(folderDist)

.then (function(file) {
  for (i = 0; i < file.length; i++) {
    fs.unlink(`${folderDist}/${file[i]}`, (err) => {
      if (err) console.log(err);
    });
  }
})

.then (function() {
  fs.readdir(folder, (err, file) => {
    if (err) console.log(err);
    for (i = 0; i < file.length; i++) {
      fs.createReadStream(`${folder}/${file[i]}`).pipe(fs.createWriteStream(`${folderDist}/${file[i]}`));
  }
  });
})

