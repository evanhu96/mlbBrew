const { Schema, model } = require("mongoose");

const gameRefSchema = new Schema({
  home: {
    type: String,
    required: true,
  },
  away: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const GameRef = model("GameRef", gameRefSchema);

module.exports = GameRef;
