const fs = require("fs");

const dataPath = "./data/users.json";

module.exports = (app) => {
  /* GET home page. */

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  // GET
  app.get("/chat/api/users", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });
};
