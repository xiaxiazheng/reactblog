const http = require('http');
const { exec } = require('child_process');

http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By",' 3.2.1')
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log(req.url)
  res.write(JSON.stringify(req.url));

  exec(`code ${req.url.replace('/?path=', '')}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  })

  // ls.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
  
  // ls.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });
  
  // ls.on('close', (code) => {
  //   console.log(`子进程退出，退出码 ${code}`);
  // });

  // 接收请求，然后运行 code 命令打开插件
  res.end('123');
}).listen(8080);