const http = require('http');
const fs = require('fs');
const yaml = require('js-yaml');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req, res) {
  fs.readFile('index.html', function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  })
});

server.listen(port, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
});


try {
  const config = yaml.safeLoad(fs.readFileSync('PerksPreferences.yaml', 'utf8'));
  const indentedJson = JSON.stringify(config, null, 4);
  console.log(indentedJson);
} catch (e) {
  console.log(e);
}
