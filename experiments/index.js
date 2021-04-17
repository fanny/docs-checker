const { exec } = require("child_process");
const { performance } = require('perf_hooks');

async function execShellCommand(cmd) {
    return new Promise((resolve, _reject) => {
      exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        } else if (stdout) {
          console.log(stdout); 
        } else {
          console.log(stderr);
        }
        resolve(stdout ? true : false);
      });
    });
}

async function main() {
    for(let i = 0; i < 40; i++){
        const t0 = performance.now();
        await execShellCommand(`docs-checker run tests/docs-10/Advanced\\ Types.md`);
        const t1 = performance.now();
        console.log(`Took ${i} ${(t1 - t0).toFixed(4)} milliseconds to generate: `);
    }
}
//find . -name "*.md" -print0 | xargs -0 docs-checker run
main()

