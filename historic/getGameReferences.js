const axios = require("axios");
const cheerio = require("cheerio");
const GameRef = require("../models/GameRef");
const baseUrl = "https://www.espn.com/mlb/team/schedule/_/name/";
const connection = require("../config/connection");

// Function to generate URLs for the specified years, seasons, and teams
function generateUrls() {
  // const years = Array.from({ length: 10 }, (_, index) => 2014 + index); // Years 2014 to 2023
  // const seasons = ["2"]; // Season type 2
  const halves = ["1", "2"]; // Both halves

  const teamAbbreviations = [
    "ari",
    "atl",
    "bal",
    "bos",
    "chc",
    "chw",
    "cin",
    "cle",
    "col",
    "det",
    "hou",
    "kc",
    "laa",
    "lad",
    "mia",
    "mil",
    "min",
    "nyy",
    "nym",
    "oak",
    "phi",
    "pit",
    "sd",
    "sf",
    "sea",
    "stl",
    "tb",
    "tex",
    "tor",
    "wsh",
    // Add more team abbreviations as needed
    // ...
  ];

  const urls = [];

  for (const half of halves) {
    for (const team of teamAbbreviations) {
      const url = `${baseUrl}${team}/season/2023/seasontype/2/half/${half}`;
      urls.push(url);
    }
  }

  return urls;
}
const main = async () => {
  const urls = generateUrls();

  const set = new Set();
  for (var i = 0; i < urls.length; i++) {

    
    const url = urls[i];
    console.log(`Fetching ${url}`);
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      // Find all <a> links with href containing the specified pattern
      $("tr").each((index, element) => {
        const aLink = 'a[href*="https://www.espn.com/mlb/game/_/gameId"]';
        const opponentClass = ".flex.items-center.opponent-logo";
        // if tr contains aLink else continue
        const elementText = $(element).text();
        if (
          elementText.includes("DATEOPPONENTRESULTW-LWINLOSSSAVEATT") ||
          elementText.includes("Postponed")
        ) {
          return;
        } else {
          // log text
          // console.log($(element).text());
        }
        const aLinkElement = $(element).find(aLink);
        // Extract the href attribute from the <a> link
        const link = $(aLinkElement).attr("href");
        const gameId = link.split("gameId/")[1].split("/")[0];
        const team = url.split(baseUrl)[1].split("/")[0];
        const isHome =
          $(element).find(opponentClass).text().trim().split(" ")[0] === "vs";
        const oppTeam = $(element)
          .find(opponentClass)
          .find("a")
          .attr("href")
          .split("name/")[1]
          .split("/")[0];
        const home = isHome ? team : oppTeam;
        const away = isHome ? oppTeam : team;
        // get first td
        const td = $(element).find("td");
        const date = $(td[0]).text();
        const epoch = new Date(date).getTime();

        const gameRef = {
          gameId,
          home,
          away,
          date,
          epoch,
        };
        set.add(gameRef);
      });
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return set;
};


module.exports = main;
