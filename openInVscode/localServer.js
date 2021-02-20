/**
 * 监听打开元素对应组件的请求，并打开文件
 * 这是要单独起服务的方案，如果是 cra 的话，在 webpack 的 devServer.before 中使用中间件监听会更好
 * 本项目未采用使用本文件单独起服务的方案，而是在 config-overrides.js 文件中引入 devServerMiddleware.ts 中间件监听
 */
const http = require("http");
const { exec } = require("child_process");

http
  .createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT,POST,GET,DELETE,OPTIONS"
    );
    res.setHeader("X-Powered-By", " 3.2.1");
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(JSON.stringify(req.url));

    const params = url.parse(req.url, true).query;
    console.log(req.url);
    console.log(`code -g ${params.path}:${params.line}:${params.col}`);

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

    // 接收请求，然后运行 code 命令打开插件
    res.end("123");
  })
  .listen(8080);
