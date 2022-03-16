const http = require('http')
const express = require('express')
var osc = require("osc")

const PORT = process.env.PORT || 8000

let oscData = {};

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121, //needs to be reflected in the max patch
    metadata: true
});

// Open the udp port.
udpPort.open();

const app = express()
app.use(express.static('public'))

app.set('port', PORT)

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port '+PORT)
})

// Web sockets
const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id)

  socket.on('data', (data) => {
    oscData.var1 = data.var1;
    oscData.var2 = data.var2;
    socket.broadcast.emit('data', oscData);
    sendOSC();
  })

  socket.on('disconnect', () => console.log('Client has disconnected'))
})

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message just arrived!", oscMsg);
    console.log("Remote info is: ", info);
    //we get a message something like:  { address: '/amp', args: [ { type: 'f', value: 93.71991729736328 } ] }
    let value = oscMsg.args[0].value; //parse osc from max
    //console.log(value);
    oscData.amp = value;
    io.sockets.emit('data', oscData);
});

// SENDING OSC
function sendOSC(){
  //console.log("sending OSC")

      udpPort.send({
          address: "/stuff", //you can make this address anything
          args: [
              {
                  type: "i", //change to f if you want to send a float
                  value: oscData.var1
              },
              {
                  type: "i",
                  value: oscData.var2
              }
          ]
      }, "127.0.0.1", 1313); //needs to match port in max
}

server.listen(PORT)