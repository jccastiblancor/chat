const fs = require("fs");
const messageSchema = require("../schemas/message");

const dataPath = "./data/msg.json";

module.exports = (app) => {
  const validateMessage = (req, res, next) => {
    const { error } = messageSchema.validate({
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    });

    if (error) {
      return res.status(400).send(error.details);
    }

    next();
  };

  const validatedb = (req, res, next) => {
    readFile((data) => {
      const Id = req.params.ts;

      if (!data[Id]) {
        return res.status(400).send("No existe el ts especificado");
      }
    }, true);
    next();
  };

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

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // GET
  app.get("/chat/api/messages", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  // GET detail
  app.get("/chat/api/messages/:ts", validatedb, (req, res) => {
    console.log(req.params.ts);
    readFile((data) => {
      res.send(data[req.params.ts]);
    }, true);
  });

  // CREATE
  app.post("/chat/api/messages", validateMessage, (req, res) => {
    readFile((data) => {
      const newId = req.body.ts;

      const message = {
        message: req.body.message,
        author: req.body.author,
        ts: req.body.ts,
      };

      data[newId] = message;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send("new message added");
      });
    }, true);
  });

  // UPDATE
  app.put("/chat/api/messages/:ts", validateMessage, validatedb, (req, res) => {
    readFile((data) => {
      const Id = req.params.ts;

      const message = {
        message: req.body.message,
        author: req.body.author,
        ts: req.params.ts,
      };

      console.log(Id, req.body);
      data[Id] = message;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`message ts:${req.params.ts} updated`);
      });
    }, true);
  });

  // DELETE
  app.delete("/chat/api/messages/:ts", validatedb, (req, res) => {
    readFile((data) => {
      const Id = req.params.ts;

      delete data[Id];

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`message ts:${req.params.ts} removed`);
      });
    }, true);
  });
};
