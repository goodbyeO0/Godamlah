import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION);

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  let allChatData = [];

  try {
    await client.connect();
    console.log("Connected successfully!");

    console.log("Fetching messages...");
    const result = await client.invoke(
      new Api.messages.GetHistory({
        peer: -4786097455,
        limit: 100,
        offsetId: 0,
        offsetDate: 0,
        addOffset: 0,
        maxId: 0,
        minId: 0,
        hash: 0
      })
    );
    
    console.log(`Found ${result.count} total messages`);
    
    // Function to get sender info from users array
    const getSenderInfo = (fromId, users) => {
      const user = users.find(u => u.id.toString() === fromId?.userId?.toString());
      if (user) {
        return {
          username: user.username || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          phone: user.phone || null
        };
      }
      return null;
    };

    // Process initial batch of messages
    for (const msg of result.messages) {
      const senderInfo = getSenderInfo(msg.fromId, result.users);
      
      const messageData = {
        id: msg.id,
        date: new Date(msg.date * 1000).toLocaleString(),
        sender: senderInfo,
        message: msg.message || "",
        media: null
      };

      if (msg.media) {
        console.log(`Processing media from message ${msg.id}...`);
        try {
          if (msg.media.photo || msg.media.document) {
            const buffer = await client.downloadMedia(msg.media);
            const base64Image = buffer.toString('base64');
            messageData.media = {
              type: msg.media.className,
              base64: base64Image
            };
          }
        } catch (err) {
          console.error(`Failed to process media from message ${msg.id}:`, err.message);
        }
      }

      allChatData.push(messageData);
    }

    // If there are more messages
    if (result.count > result.messages.length) {
      console.log("Fetching additional messages...");
      let lastId = result.messages[result.messages.length - 1].id;

      while (true) {
        console.log(`Fetching messages before ID ${lastId}...`);
        const moreMessages = await client.invoke(
          new Api.messages.GetHistory({
            peer: -4786097455,
            limit: 100,
            offsetId: lastId,
            offsetDate: 0,
            addOffset: 0,
            maxId: 0,
            minId: 0,
            hash: 0
          })
        );

        if (moreMessages.messages.length === 0) {
          console.log("No more messages found");
          break;
        }
        
        // Process additional messages
        for (const msg of moreMessages.messages) {
          const senderInfo = getSenderInfo(msg.fromId, moreMessages.users);
          
          const messageData = {
            id: msg.id,
            date: new Date(msg.date * 1000).toLocaleString(),
            sender: senderInfo,
            message: msg.message || "",
            media: null
          };

          if (msg.media) {
            console.log(`Processing media from message ${msg.id}...`);
            try {
              if (msg.media.photo || msg.media.document) {
                const buffer = await client.downloadMedia(msg.media);
                const base64Image = buffer.toString('base64');
                messageData.media = {
                  type: msg.media.className,
                  base64: base64Image
                };
              }
            } catch (err) {
              console.error(`Failed to process media from message ${msg.id}:`, err.message);
            }
          }

          allChatData.push(messageData);
        }
        
        lastId = moreMessages.messages[moreMessages.messages.length - 1].id;
      }
    }

    // Save all data to JSON file
    const outputData = {
      chatName: "Godamlah Test",
      totalMessages: allChatData.length,
      messages: allChatData
    };

    fs.writeFileSync('chat_data.json', JSON.stringify(outputData, null, 2));
    console.log("Data saved to chat_data.json");

  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    console.log("Disconnecting...");
    await client.disconnect();
    console.log("Disconnected");
  }
})();