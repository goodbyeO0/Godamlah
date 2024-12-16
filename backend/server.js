const express = require("express");
const fs = require("fs");
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
require("dotenv").config();
const path = require("path");

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

    console.log("Setup complete");
    //* can test functions here
    console.log(await beingAddedToNewGroup());
    // await sendMessageToUser("@goodbye000000", "watashi sigman");
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
        limit: 50,
        offsetId: 0,
        offsetDate: 0,
        addOffset: 0,
        maxId: 0,
        minId: 0,
        hash: 0,
      })
    );

    // Process messages with detailed information
    const messages = await Promise.all(
      result.messages.map(async (msg) => {
        // Get sender information
        const sender = msg.fromId ? await client.getEntity(msg.fromId) : null;

        const messageData = {
          id: msg.id,
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
          message: msg.message || null,
          sender: sender
            ? {
                id: sender.id.toString(),
                username: sender.username || null,
                firstName: sender.firstName || null,
                lastName: sender.lastName || null,
                phone: sender.phone || null,
              }
            : null,
        };

        // Handle media content
        if (msg.media) {
          console.log(`Processing media from message ${msg.id}...`);
          try {
            if (msg.media.photo || msg.media.document) {
              const buffer = await client.downloadMedia(msg.media);
              const base64Image = buffer.toString("base64");
              messageData.media = {
                type: msg.media.className,
                base64: base64Image,
              };
            }
          } catch (err) {
            console.error(
              `Failed to process media from message ${msg.id}:`,
              err.message
            );
          }
        }

        return messageData;
      })
    );

    chatHistories.push({
      chatId: groupId,
      title: GroupUsername,
      messages: messages,
    });

    // Create messageHistory directory if it doesn't exist
    const messageHistoryDir = path.join(__dirname, "messageHistory");
    if (!fs.existsSync(messageHistoryDir)) {
      fs.mkdirSync(messageHistoryDir);
    }

    // Create filename with group name and current date/time in Malaysia timezone
    const now = new Date()
      .toLocaleString("en-US", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[/:,\s]/g, "_");

    const filename = `${GroupUsername}_${now}.json`;
    const filePath = path.join(messageHistoryDir, filename);

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(chatHistories, null, 2), "utf-8");

    console.log(`Chat history saved to ${filePath}`);
    return { filePath: `${GroupUsername}_${now}.json` };
  } catch (error) {
    console.error("Failed to fetch chat histories:", error);
  }
};

const beingAddedToNewGroup = async () => {
  let status = null;
  try {
    // Listen to ALL updates
    client.addEventHandler(async (update) => {
      if (update.className === "UpdateChannel") {
        const groupName = await getGroupName(update.channelId.value);
        status =
          groupName === "Not a member"
            ? "Left/Kicked from group"
            : "Added to group";

        console.log("New update:", {
          type: update.className,
          status: status,
          groupName: groupName,
          channelId: update.channelId.value,
        });

        const result = await fetchChatHistory(groupName);

        if (result && result.filePath) {
          // Read and parse the JSON file
          const messageHistoryDir = path.join(__dirname, "messageHistory");
          const filePath = path.join(messageHistoryDir, result.filePath);

          try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const jsonData = JSON.parse(fileContent);

            // Arrays to store different types of messages
            const textMessages = [];
            const mediaMessages = [];

            // Process each message
            jsonData[0].messages.forEach((msg) => {
              if (msg.media) {
                // If message has media, add to mediaMessages
                mediaMessages.push(msg);
              } else if (msg.message !== null) {
                // If message has text but no media, add to textMessages
                textMessages.push(msg);
              }
            });

            aiQueryText({
              question: `based on the following messages that i got from a telegram group chat which is ${
                jsonData[0].title
              }, can you identify if the group is a scam or not and why it is a scam group, make sure mention back the group name , your answer don't need to be long and make it in point, because i will use your response to forward it to someone from by using telegram and i use automation, so make it like you chat with someone: ${textMessages
                .map((data) => data.message)
                .join(" ")}`,
            }).then((response) => {
              console.log(response.text);
              sendMessageToUser("@goodbye000000", response.text);
            });
          } catch (error) {
            console.error("Error processing JSON file:", error);
          }
        }
      }
    });
    console.log("Event handler setup complete");
    return status;
  } catch (error) {
    console.error("Error setting up event handlers:", error);
  }
};

// get group name from id
const getGroupName = async (groupId) => {
  try {
    // Get the chat/channel information
    const entity = await client.getEntity(groupId);

    // The title property contains the group/channel name
    if (entity.title) {
      console.log(`Group Name: ${entity.title}`);
      return entity.title;
    } else {
      return "Unknown Group";
    }
  } catch (error) {
    if (error.errorMessage === "CHANNEL_PRIVATE") {
      return "Not a member";
    } else {
      return "Error getting group name";
    }
  }
};

const sendMessageToUser = async (username, message) => {
  try {
    // Make sure username starts with @
    const formattedUsername = username.startsWith("@")
      ? username
      : `@${username}`;

    // Get the entity (user) from username
    const entity = await client.getEntity(formattedUsername);

    if (!entity) {
      throw new Error(`User ${formattedUsername} not found`);
    }

    // Send the message
    const result = await client.sendMessage(entity, {
      message: message,
    });

    console.log(`Message sent successfully to ${formattedUsername}`);
    return {
      success: true,
      messageId: result.id,
      timestamp: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kuala_Lumpur",
      }),
    };
  } catch (error) {
    console.error(`Failed to send message to ${username}:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
};

async function aiQueryText(data) {
  const response = await fetch(
    "http://localhost:3000/api/v1/prediction/722a1f44-d0d1-42ad-b2c6-01f73fa44fb3",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
