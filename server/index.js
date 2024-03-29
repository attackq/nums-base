const app = require("express")();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

const port = 5005;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    console.log(message);
    console.log(socket.id);
    io.emit("message", `${socket.id.substr(0, 2)}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
