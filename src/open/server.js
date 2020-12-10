const http = require('http');
http.createServer(function (req, res) {
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  // res.write('Hello World!');

  // 接收请求，然后运行 code 命令打开插件
  res.end('123');
}).listen(8080);