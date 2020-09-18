const WebSocket = require("ws");
const axios = require("axios");

const clients = [];
var messages = [];
const newMsg = [];

const url = "http://localhost:3000/chat/api/messages";

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    sendMessages();

    ws.on("message", (msg) => {
      console.log(msg);
      newMsg.push(msg);
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach(async (client) => {
      const json = await axios.get(url);
      messages = [];
      for (i in json.data) {
        messages.push(json.data[i].message);
      }
      console.log(messages, newMsg);
      messages = messages.concat(newMsg);
      console.log(messages);
      client.send(JSON.stringify(messages));
    });
  };
};

exports.wsConnection = wsConnection;
