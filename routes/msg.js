const messageSchema = require("../schemas/message");
const Msg = require("../schemas/msg");

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
    Msg.find({}).then((data) => {
      res.send(data);
    });
  });

  // GET detail
  app.get("/chat/api/messages/:ts", (req, res) => {
    Msg.findOne({ ts: req.params.ts }).then((doc) => {
      if (doc) {
        res.send(doc);
      } else {
        res.send("no data exist for this ts");
      }
    });
  });

  // CREATE
  app.post("/chat/api/messages", validateMessage, (req, res) => {
    let newMsg = new Msg({
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    });
    newMsg.save().then((data) => {
      res.send(data);
    });
  });

  // UPDATE
  app.put("/chat/api/messages/:ts", validateMessage, (req, res) => {
    Msg.update(
      { ts: req.params.ts },
      {
        $set: {
          message: req.body.message,
          author: req.body.author,
        },
      },
      {
        multi: true,
        new: true,
      }
    ).then((doc) => {
      if (doc) {
        res.send(doc);
      } else {
        res.send("no data exist for this ts");
      }
    });
  });

  // DELETE
  app.delete("/chat/api/messages/:ts", (req, res) => {
    Msg.remove({ ts: req.params.ts }).then((doc) => {
      if (doc) {
        res.send(doc);
      } else {
        res.send("no data exist for this ts");
      }
    });
  });
};
