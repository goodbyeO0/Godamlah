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
        text: message.text,
      });
    }
  }, new NewMessage({})); // Listen for new messages
}).catch(error => {
  console.error("Failed to start client:", error);
});

// To send message
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

//to message participant - failed
app.post("/message-participants", async (req, res) => {
  const { channelUsername, message } = req.body;

  try {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 10,
    });

    await client.start();

    // Fetch participants
    const participants = await client.invoke(
      new Api.channels.GetParticipants({
        channel: channelUsername,
        filter: new Api.ChannelParticipantsRecent({}),
        offset: 0,
        limit: 100,
        hash: BigInt("-4156887774564"),
      })
    );

    // Send message to each participant
    for (const participant of participants.users) {
      try {
        await client.sendMessage(participant, { message });
        console.log(`Message sent to ${participant.username || participant.id}`);
      } catch (error) {
        console.error(`Failed to send message to ${participant.username || participant.id}:`, error);
      }
    }

    res.status(200).send("Messages sent to participants successfully.");
  } catch (error) {
    console.error("Failed to message participants:", error);
    res.status(500).send("Failed to message participants.");
  }
});

// Function to fetch message history from a group
app.post("/fetch-group-history", async (req, res) => {
  const { groupUsername, limit = 10 } = req.body; // Limit the number of messages to fetch

  try {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 10,
    });

    await client.start();

    const messages = await client.getMessages(groupUsername, { limit });
    messages.forEach(msg => {
      console.log(`Message from ${msg.fromId}: ${msg.message}`);
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch group history:", error);
    res.status(500).send("Failed to fetch group history.");
  }
});

app.post("/send-message-to-user", async (req, res) => {
  const { username, message } = req.body;

  try {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 10,
    });

    await client.start();

    // Send message to the specified user
    await client.sendMessage(username, { message });
    console.log(`Message sent to ${username}: ${message}`);
    
    res.status(200).send(`Message sent to ${username} successfully.`);
  } catch (error) {
    console.error(`Failed to send message to ${username}:`, error);
    res.status(500).send(`Failed to send message to ${username}.`);
  }
});

// Function to get participants from a group
app.post("/get-group-participants", async (req, res) => {
  const { groupUsername, offset = 0, limit = 100 } = req.body; // Default offset and limit

  try {
    const participants = await client.invoke(
      new Api.channels.GetParticipants({
        channel: groupUsername,
        filter: new Api.ChannelParticipantsRecent({}),
        offset: offset,
        limit: limit,
        hash: BigInt("-4156887774564"),
      })
    );

    // Log the participants
    console.log(`Fetched ${participants.users.length} participants from group ${groupUsername}`);
    res.status(200).json(participants.users);
  } catch (error) {
    console.error("Failed to fetch participants:", error);
    res.status(500).send("Failed to fetch participants.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});