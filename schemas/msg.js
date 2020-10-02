const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  message: String,
  author: String,
  ts: String,
});

module.exports = mongoose.model("message", messageSchema);
