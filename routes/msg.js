const messageSchema = require("../schemas/message");
const Message = require("../models/message");

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

  // GET
  app.get("/chat/api/messages", (req, res) => {
    Message.findAll().then((result) => {
      res.send(result);
    });
  });

  // GET detail
  app.get("/chat/api/messages/:ts", (req, res) => {
    Message.findByPk(req.params.ts).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send(response);
    });
  });

  // CREATE
  app.post("/chat/api/messages", validateMessage, (req, res) => {
    Message.create({
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    }).then((response) => {
      res.send(response);
    });
  });

  // UPDATE
  app.put("/chat/api/messages/:ts", validateMessage, (req, res) => {
    Message.update(req.body, {
      where: { ts: req.params.ts },
    }).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send(response);
    });
  });

  // DELETE
  app.delete("/chat/api/messages/:ts", (req, res) => {
    Message.destroy({
      where: { ts: req.params.ts },
    }).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send("Deleted");
    });
  });
};
