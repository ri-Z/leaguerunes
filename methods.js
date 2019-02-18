const request = require('request');


var conn_data = null;

function bind(data) {
	conn_data = data;
}


var methods = {};
["post", "put", "get", "del"].forEach(function(method) {
	methods[method] = function(endpoint, body) {
		return new Promise(resolve => {	
			setTimeout(() => {
				var options = {
					// url: conn_data.protocol+"://"+ conn_data.address+":"+conn_data.port+endpoint,
					url: `${conn_data.protocol}://${conn_data.address}:${conn_data.port}${endpoint}`,
					auth: {
						"user": conn_data.username,
						"pass": conn_data.password
					},
					headers: {
						'Accept': 'application/json'
					},
					json: true,
					body: body,
					rejectUnauthorized: false
				};

				request[method](options, (error, response, data) => {
					if (error || response.statusCode != 200) {
						resolve();
						return;
					}

					resolve(data);
				});
			}, 1000)
		});
  };
});

module.exports = Object.assign({bind}, methods);