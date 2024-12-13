const express = require("express");
const fs = require("fs");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
require("dotenv").config();

const apiId = process.env.API_ID;
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

app.post("/send-message", async (req, res) => {
  const { message } = req.body;

  try {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 10,
    });

    // Start the client and handle login
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () => await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });

    // Save the session string to a file
    fs.writeFileSync(sessionFilePath, client.session.save());

    await client.sendMessage("me", { message });
    console.log("Message sent successfully.");
    res.status(200).send("Message sent successfully.");
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(500).send("Failed to send message.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});