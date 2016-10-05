var Gpio = require('onoff').Gpio;
var http = require('http');
var url = require('url'); 
var localip = require('local-ip');
var interface = 'wlan0';
var localipaddr = '';
localip(interface, function(err, res) {
  if (err) {
    throw new Error('I have no idea what my local ip is.');
  }
  localipaddr = res;
});
var turn_on = function(led) {
	led.writeSync(led.readSync() === 0 ? 1 : 0);
	console.log('On');
};
var turn_off = function(led) {
    	// clearInterval(iv); // Stop blinking
    	led.writeSync(0);  // Turn LED off.
    	led.unexport();    // Unexport GPIO and free resources
  	console.log('Off');
}; 

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});

  if (queryData.pin) {
	var led = new Gpio(queryData.pin, 'out');
	// var iv = setInterval(function(){
		turn_on(led);
	// }, 500);
	turn_off(led);
	response.end('1');
  } else {
    response.end("Hello World\n");
  }
});

server.listen(8000, function () {
  console.log('Example app '+ localipaddr +' listening on port 8000!');
});
