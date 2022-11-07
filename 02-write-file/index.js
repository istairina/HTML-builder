const fs = require('fs');
const readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

let writeText = function (answer) {

  if (answer.includes('exit')) {
    console.log('Bye-bye! Come back soon');
    rl.close();
  } else {
    answer += '\n';
    fs.appendFile('02-write-file/output.txt', answer, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}

rl.question('What is your favorite city?\n', (answer) => {
  writeText(answer);
  rl.on('line', (answer) => {
    writeText(answer);
  });
});

rl.on('SIGINT', () => {
  console.log('\nBye-bye! Come back soon');
  rl.close();
});