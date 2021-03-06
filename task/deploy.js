console.log("deploy it");

const path = require("path");
const { logger, shelljs, execSync, shellExec } = require("./utils");

logger.base(`开始部署: `);

shelljs.set("-e");

function start() {
  // 打包代码
  console.log(shellExec(`yarn build`))
  console.log(shelljs.cd('../myserver'))
  console.log(shellExec(`git pull`))
  console.log(shellExec(`rm -rf www`))
  console.log(shellExec(`mkdir www`))
  console.log(shellExec(`cp -rf ../reactblog/build/* www`))
  console.log(shellExec(`git add --all`))
  console.log(shellExec(`git commit -m "feat: 更新前端代码"`))
  console.log(shellExec(`git push`))

  process.exit(0)
}

start();
