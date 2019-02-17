const http = require('http');
const fs = require('fs');
const yaml = require('js-yaml');
const express = require('express');
const app = express();

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

app.listen(port, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
});


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
   console.log("Got a GET request for the homepage");
})

// This responds with "Hello World" on the homepage
// app.get('/', function (req, res) {
//    console.log("Got a GET request for the homepage");
//    res.send('Hello GET');
// })
//
// // This responds a POST request for the homepage
// app.post('/', function (req, res) {
//    console.log("Got a POST request for the homepage");
//    res.send('Hello POST');
// })

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

app.get('/yaml', function (req, res) {
  const config = yaml.safeLoad(fs.readFileSync('PerksPreferences.yaml', 'utf8'));
  const indentedJson = JSON.stringify(config, null, 4);
  console.log("indentedJSON", indentedJson);
  const dumpYAML = yaml.safeDump(JSON.parse(indentedJson));
  console.log("dumpYAML", dumpYAML);
  fs.writeFileSync('./runes.yaml', dumpYAML);
  res.send(dumpYAML);
})

app.get('/dump', function (req, res) {

  const dump = yaml.safeDump(require('./PerksPreferences.yaml'), {
    styles:{
      '!!int' : 'decimal',
      '!!null': 'lowercase'
    },
    sortKeys: true
  })
  res.send(dump);
})