const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  console.log(req.url)
  res.write(JSON.stringify(req.url));

  // 接收请求，然后运行 code 命令打开插件
  res.end('123');
}).listen(8080);