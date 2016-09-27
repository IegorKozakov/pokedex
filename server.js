const http = require('http');
const static = require('node-static');
const file = new static.Server('.');
const port = Number(process.env.PORT || 3000);

http.createServer(function(req, res) {
	file.serve(req, res);
}).listen(port);
