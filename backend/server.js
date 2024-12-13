const express = require("express");
const fs = require("fs");
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
require("dotenv").config();

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionFilePath = process.env.SESSION_FILE_PATH;
const PORT = process.env.PORT || 3000;

// Load the session from the file if it exists
let stringSession;
if (fs.existsSync(sessionFilePath)) {
  const sessionData = fs.readFileSync(sessionFilePath, "utf-8");
  stringSession = new StringSession(sessionData);
} else {
  stringSession = new StringSession(""); // Empty session if file doesn't exist
}

const app = express();

app.use(express.json());

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 10,
});

// Start the client and listen for incoming messages
client.start({
  phoneNumber: async () => await input.text("Please enter your number: "),
  password: async () => await input.text("Please enter your password: "),
  phoneCode: async () => await input.text("Please enter the code you received: "),
  onError: (err) => console.log(err),
}).then(() => {
  console.log("Client started. Listening for incoming messages...");

  // Add event handler for new messages
  client.addEventHandler(async (event) => {
    const message = event.message;

    if (message) {
      console.log("New message received:", message.text);

      // Log message details to console
      console.log({
        senderId: message.senderId,
        chatId: message.peerId,
        // text: message.text,
      });
    }
  }, new NewMessage({})); // Listen for new messages
}).catch(error => {
  console.error("Failed to start client:", error);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});