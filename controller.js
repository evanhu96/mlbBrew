// connect to database
const GameRef = require("./models/GameRef");
const connection = require("./config/connection");

const getGameReferences = require("./historic/getGameReferences");
//connect to database
connection.on("open", async () => {
  console.log("Connected to database");
  // retrive gameRefs set
  const gameRefs = await getGameReferences();
  // add gameRefs to database
  // check game refs for required fields
  for (const gameRef of gameRefs) {
    const { gameId, home, away, date, epoch } = gameRef;
    const gameRefDoc = new GameRef({
      gameId,
      home,
      away,
      date,
      epoch,
    });
    try {
      await gameRefDoc.save();
    } catch (error) {
      console.error(error);
      console.log("GameRef not saved");
      console.log(gameRef)
    }
  }
});
