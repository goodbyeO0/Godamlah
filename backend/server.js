const express = require("express");
const fs = require("fs");
const path = require("path");
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
          text: message.text,
        });
      }
    }, new NewMessage({})); // Listen for new messages
  }).catch(error => {
    console.error("Failed to start client:", error);
  });

  // New endpoint to get available chats (dialogs)
app.get("/get-dialogs", async (req, res) => {
  try {
    const dialogs = await client.getDialogs();
    console.log("Available chats:");

    // Prepare the dialogs for JSON response
    const dialogList = dialogs.map((dialog, index) => ({
      index: index + 1,
      title: dialog.title || dialog.username || "No Title",
      id: dialog.id,
    }));

    // Log the dialogs to the console
    dialogList.forEach(dialog => {
      console.log(`${dialog.index}. Title: ${dialog.title} (ID: ${dialog.id})`);
    });

    // Write the dialogs to a JSON file
    fs.writeFileSync('dialogs.json', JSON.stringify(dialogList, null, 2), 'utf-8');

    // Return the dialogs as a JSON response
    res.status(200).json(dialogList);

  } catch (error) {
    console.error("Failed to fetch dialogs:", error);
    res.status(500).send("Failed to fetch dialogs.");
  }
});

// New endpoint to fetch chat history and store it in another JSON file
app.get("/fetch-chat-history", async (req, res) => {
  try {
    const dialogs = JSON.parse(fs.readFileSync("dialogs.json", "utf-8")).slice(0, 50);
    const chatHistories = [];

    for (const dialog of dialogs) {
      // Skip fetching history if the dialog is a bot or a wallet
      if (dialog.title.toLowerCase().includes("bot") || dialog.title.toLowerCase().includes("wallet")) {
        console.log(`Skipping bot or wallet dialog: ${dialog.title}`);
        continue;
      }

      const result = await client.invoke(
        new Api.messages.GetHistory({
          peer: dialog.id,
          limit: 100,
          offsetId: 0,
          offsetDate: 0,
          addOffset: 0,
          maxId: 0,
          minId: 0,
          hash: 0
        })
      );

      chatHistories.push({
        chatId: dialog.id,
        title: dialog.title,
        messages: result.messages.map(msg => ({
          id: msg.id,
          fromId: msg.fromId,
          message: msg.message,
          date: msg.date,
        })),
      });
    }

    fs.writeFileSync("chatHistories.json", JSON.stringify(chatHistories, null, 2), "utf-8");
    res.status(200).send("Chat histories fetched and stored successfully.");
  } catch (error) {
    console.error("Failed to fetch chat histories:", error);
    res.status(500).send("Failed to fetch chat histories.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
