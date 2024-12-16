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

let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const MESSAGE_LIMIT = 10; // Fetch only last 10 messages
const DIALOG_LIMIT = 5;   // Fetch only last 5 chats

async function fetchLatestChats(client, force = false) {
  // Check cache
  const now = Date.now();
  if (!force && cachedData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Returning cached data');
    return cachedData;
  }

  try {
    console.log('Fetching fresh data...');
    // Get only limited number of recent dialogs
    const dialogs = await client.getDialogs({
      limit: DIALOG_LIMIT
    });

    // Prepare limited dialogs list
    const dialogList = dialogs.map((dialog, index) => ({
      index: index + 1,
      title: dialog.title || dialog.username || "No Title",
      id: dialog.id,
    }));

    const chatHistories = [];

    for (const dialog of dialogList) {
      if (dialog.title.toLowerCase().includes("bot") || dialog.title.toLowerCase().includes("wallet")) {
        continue;
      }

      // Get only limited number of messages per chat
      const result = await client.invoke(
        new Api.messages.GetHistory({
          peer: dialog.id,
          limit: MESSAGE_LIMIT,
          offsetId: 0,
          offsetDate: 0,
          addOffset: 0,
        })
      );

      const messages = await Promise.all(result.messages.map(async (msg) => ({
        id: msg.id,
        date: msg.date,
        message: msg.message,
        media: msg.media ? {
          type: msg.media.className
        } : null
      })));

      chatHistories.push({
        dialogId: dialog.id,
        title: dialog.title,
        history: messages,
      });
    }

    // Update cache
    cachedData = { dialogList, chatHistories };
    lastFetchTime = now;

    // Save to files
    fs.writeFileSync('latest_chats.json', JSON.stringify(cachedData, null, 2), 'utf-8');

    return cachedData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to fetch latest chats");
  }
}

// Update endpoint to use new function
app.get("/fetch", async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const data = await fetchLatestChats(client, force);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
