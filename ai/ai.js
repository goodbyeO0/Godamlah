const fs = require('fs');

const data = fs.readFileSync('dummyDataChat/chatMessage.json', 'utf8');
const jsonData = JSON.parse(data);
const messages = jsonData.message;


async function query(data) {
    const response = await fetch(
        "http://localhost:3000/api/v1/prediction/722a1f44-d0d1-42ad-b2c6-01f73fa44fb3",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": `based on the following messages that i got from a telegram group chat, can you identify if the group is a scam or not and why it is a scam group: ${messages}`}).then((response) => {
    console.log(response);
});