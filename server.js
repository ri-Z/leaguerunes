const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();
const api = require('./methods');


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
  fs.writeFileSync('./runesJSON.json', indentedJson);
  //console.log("indentedJSON", indentedJson);



  const perks = require('./runesJSON.json');
  const yikes = perks["page-settings"].data.perShardPerkBooks.euw1.pages[0];
  //let yikesObjectvalues = Object.values(yikes[0])[8];
  console.log("yikes - ", yikes['name']);

  yikesNameObjectvalues = "loladamixtape";
  console.log("yikes1 - ", yikesNameObjectvalues);
  yikes['name'] = yikesNameObjectvalues;
  console.log("YIKESMASTER - ", yikes['name']);

  yikesTimeObjectvalues = new Date().getTime();
  console.log("Timestamp in Ms - ", yikesTimeObjectvalues);
  yikes['lastModified'] = yikesTimeObjectvalues;
  console.log("yikesTimeObjectvalues - ", yikes['lastModified']);
  
  yikesActiveObjectvalues = true;
  console.log('bool - ', yikesActiveObjectvalues);
  yikes['isActive'] = yikesActiveObjectvalues;
  console.log("yikesActiveObjectvalues - ", yikes['isActive']);


  const updatedFile = JSON.stringify(perks, null, 4);
  fs.writeFileSync('./runesJSON.json', updatedFile);



  const dumpYAML = yaml.safeDump(JSON.parse(updatedFile));
  //console.log("dumpYAML", dumpYAML);
  fs.writeFileSync('./runesYAML.yaml', dumpYAML);
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


connector.on('connect', (data) => {
  console.log(data);
  //  {
  //    address: '127.0.0.1'
  //    port: 18633,
  //    username: 'riot',
  //    password: H9y4kOYVkmjWu_5mVIg1qQ,
  //    protocol: 'https'
  //  }
  api.bind(data);
});

connector.on('disconnect', () => {
	console.log("client closed");
});

// Start listening for the LCU client
connector.start();

app.get('/update', function (req, res) {
  api.get("/lol-summoner/v1/current-summoner").then((summoner) => {
    if(!summoner) {
      console.log("no summoner response");
      return;
    }else{
      //console.log(summoner);
      console.log(summoner.displayName);
    }
    res.send(summoner);
  });


  api.get("/network-testing/v1/game-latency").then((latency) => {
    if(!latency) {
      console.log("no latency response");
      return;
    }else{
      console.log(latency);
      console.log(latency.results["latency"]);
    }
  });
})


app.get('/createrune', function (req, res) {
  
  api.del("/lol-perks/v1/pages/").then((res) => {
			console.log("api delete current page", res);
  });

  api.post("/lol-perks/v1/pages/").then((res) => {
			console.log("api post on current page", res);
  });

   res.send('Rune Created?');
})


// app.post('/createrune', function (req, res) {
  
  

//   res.send('Rune Created?');
// })