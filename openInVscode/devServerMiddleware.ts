/**
 * 用于 webpack 中 devServer.before 的中间件，监听打开文件的请求并在 vscode 中打开文件
 */
const { exec } = require("child_process");
const url = require('url')

function devServerMiddleware(app) {
  app.use("/__open_in_editor", (req, res, next) => {
    const params = url.parse(req.url, true).query
    
    console.log(req.url)
    console.log(`code -g ${params.path}:${params.line}:${params.col}`)

    exec(
      `code -g ${params.path}:${params.line}:${params.col}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`执行的错误: ${error}`);
          return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);
      }
    );
  });
}

module.exports = devServerMiddleware