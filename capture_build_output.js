const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cwd = path.resolve(__dirname);
let out = '';
try {
  out = execFileSync('npm', ['run', 'build'], { cwd, stdio: 'pipe', encoding: 'utf8' });
  fs.writeFileSync(path.join(cwd, 'capture_build_output.txt'), 'SUCCESS\n' + out);
} catch (err) {
  const stdout = err.stdout || '';
  const stderr = err.stderr || '';
  fs.writeFileSync(path.join(cwd, 'capture_build_output.txt'), 'FAIL\n' + stdout + stderr);
  process.exit(1);
}
