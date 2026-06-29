const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.jsx');
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const start = 620;
const end = 660;
for (let i = start; i < end; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
