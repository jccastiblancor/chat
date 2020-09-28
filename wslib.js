const WebSocket = require("ws");
const axios = require("axios");
const { date } = require("joi");

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
      messages = messages.concat(newMsg);
      client.send(JSON.stringify(messages));
    });
  };
};

exports.wsConnection = wsConnection;
