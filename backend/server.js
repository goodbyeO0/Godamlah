const express = require("express");
const fs = require("fs");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
require("dotenv").config();

const app = express();
app.use(express.json());

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const telegramSession = process.env.TELEGRAM_SESSION;
const stringSession =
  new StringSession(telegramSession) || new StringSession("");
const PORT = process.env.PORT || 3000;
let client;

// login to telegram
async function login() {
  try {
    // Initialize client
    if (telegramSession) {
      client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 10,
      });
      await client.connect();
      console.log("Connected with existing session");
    } else {
      client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });
      await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
          await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
      });
      console.log("You should now be connected.");
      console.log(client.session.save());
    }

    // Test connection
    await client.sendMessage("me", { message: "Hello!" });
    console.log("Test message sent successfully");

    // Setup event handlers
    await setupEventHandlers();
    console.log("Setup complete");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// Start the server and initialize the client
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  login();
});

// get specific id of group
const getGroupId = async (GroupUsername) => {
  try {
    const dialogs = await client.getDialogs();
    const group = dialogs.find((dialog) => dialog.title === GroupUsername);
    return group ? group.id : null;
  } catch (error) {
    console.error("Failed to fetch dialogs:", error);
    throw error;
  }
};

// get all id of group
const getAllGroupId = async () => {
  try {
    // Get and print all dialogs
    const dialogs = await client.getDialogs();
    console.log("Available chats:");
    dialogs.forEach((dialog, index) => {
      console.log(`${index + 1}. Title: ${dialog.title} (ID: ${dialog.id})`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

// fetch chat history and store it in another JSON file
const fetchChatHistory = async (GroupUsername) => {
  try {
    const chatHistories = [];
    const groupId = await getGroupId(GroupUsername);

    if (!groupId) {
      throw new Error(`Group "${GroupUsername}" not found`);
    }

    const result = await client.invoke(
      new Api.messages.GetHistory({
        peer: groupId,
        limit: 100,
        offsetId: 0,
        offsetDate: 0,
        addOffset: 0,
        maxId: 0,
        minId: 0,
        hash: 0,
      })
    );

    chatHistories.push({
      chatId: groupId,
      title: GroupUsername,
      messages: await Promise.all(
        result.messages.map(async (msg) => {
          let photoBase64 = null;

          // Check if message has photo
          if (msg.media && msg.media.photo) {
            try {
              // Download the photo
              const buffer = await client.downloadMedia(msg.media);
              // Convert buffer to base64
              photoBase64 = buffer.toString("base64");
            } catch (error) {
              console.error("Error downloading photo:", error);
            }
          }

          return {
            id: msg.id,
            fromId: msg.fromId?.userId || null,
            message: msg.message,
            photo: photoBase64, // Will be null if no photo
            date: new Date(msg.date * 1000).toLocaleString("en-US", {
              timeZone: "Asia/Kuala_Lumpur",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
          };
        })
      ),
    });

    fs.writeFileSync(
      "chatHistories.json",
      JSON.stringify(chatHistories, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to fetch chat histories:", error);
  }
};

const setupEventHandlers = async () => {
  try {
    // Listen to ALL updates
    client.addEventHandler((update) => {
      if (update) {
        // Add null check
        console.log("New update:", {
          type: update.className || update.constructor.name, // Use className or constructor.name
          update: update,
        });
      }
    });

    console.log("Event handler setup complete");
  } catch (error) {
    console.error("Error setting up event handlers:", error);
  }
};
