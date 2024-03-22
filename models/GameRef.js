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
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  epoch: {
    type: Number,
    required: true,
  },
});

const GameRef = model("GameRef", gameRefSchema);

module.exports = GameRef;
