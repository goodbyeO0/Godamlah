const json = require("./Izhan and Sigman_12_17_2024__01_17_06_AM.json");

// Filter the messages in each chat history
const filteredJson = json.map((chat) => ({
  ...chat,
  messages: chat.messages.filter(
    (msg) =>
      // Keep message if it has a non-null message and no media
      msg.message !== null && !msg.media
  ),
}));

console.log(filteredJson[0].messages);
