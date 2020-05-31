const bank_app = require("./bank_app.js");
//const bank_login_app = require('./bank_login_app');
const debug = require("debug")("node-angular");
const http = require("http");
console.log('server');
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3600");
bank_app.set("port", port);
if(port){
  console.log('port');
}
else{
  console.log('error');
}

 // bank_login_app.set("port", port);

const server = http.createServer(bank_app);
console.log('hi');
//const server = http.createServer(bank_login_app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

 





                                                                             



