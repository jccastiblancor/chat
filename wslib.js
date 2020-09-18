const WebSocket = require("ws");
const axios = require("axios");

const clients = [];
var messages = [];
const newMsg = [];

const url = "http://localhost:3000/chat/api/messages";

const start = async () => {
  const json = await axios.get(url);
  messages = [];
  for (i in json.data) {
    messages.push(json.data[i].message);
  }
};

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    start();

    sendMessages();

    ws.on("message", (msg) => {
      console.log(msg);
      newMsg.push(msg);
      sendMessages();
    });

    ws.on("close", () => {
      newMsg.map((msg) => {
        axios.post(url, {
          message: msg,
          author: "Unitato",
          ts: Date.now(),
        });
      });
    });
  });

  const sendMessages = () => {
    clients.forEach(async (client) => {
      console.log(messages, newMsg);
      messages.concat(newMsg);
      client.send(JSON.stringify(messages));
    });
  };
};

exports.wsConnection = wsConnection;
