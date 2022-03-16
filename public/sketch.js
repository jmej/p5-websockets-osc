// Keep track of our socket connection
let socket;
let timer = 0;

let myData = {var1 : 0, var2: 0}; //make an object to hold the data we want to send
let amplitude = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // Start a socket connection to the server
  socket = io.connect('localhost:8000') //change localhost:8000 for running locally
  // if this server is running somewhere else do something like:
  //socket = io.connect('https://socket-hack.herokuapp.com/');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('data',
    // When we receive data
    function(data) {
      console.log("Got: " + data.var1 + " " + data.var2 + " "+data.amp);
      // Draw a blue circle
      fill(random(255),random(255),random(255));
      noStroke();
      ellipse(data.var1,data.var2,10,10);
      amplitude = data.amp;
      //print("amplitude: "+amplitude);
    }
  );
}

function draw() {
  sendData(myData);

  ellipse(myData.var1, myData.var2, amplitude, amplitude);

}

function mouseDragged() {
  // Draw some white circles
  fill(random(255));
  noStroke();
  ellipse(mouseX,mouseY,10,10);
  // Send the mouse coordinates
  myData.var1 = mouseX; //update our data object everytime the mouse is dragged
  myData.var2 = mouseY;
}

// Function for sending to the socket
function sendData(data) {
  // We are sending!
  console.log("senddata: " + data.var1 + " " + data.var2);

  // Send that object to the socket
  socket.emit('data',data);
}