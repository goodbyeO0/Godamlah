# Backend for AI-based Phone Number

This is an instruction on how to use or run this model

## Installation

1. Make sure the directory is correct `your/file/name/backend`
2. Fill in the `.env.example` and remove the `.example` after finished editing. The sample of the .env file is as shown. 

```bash
API_ID=123456
API_HASH=abc123456
SESSION_FILE_PATH=./session.json
PORT=3000
```

Get API_ID and API_HASH from https://my.telegram.org/apps

3. Install Dependencies

```bash
npm install
```

4. Start Server

```bash
npx nodemon server.js
```

## Testing

Testing can be done by using Postman or any API testing tools

1. Open Postman
2. Create a new request
- Set the request type to POST.
- Enter the URL: http://localhost:3000/send-message.
3. Set the Request Body
- Select Body.
- Choose raw and set the format to JSON.
- Enter the following JSON in the body:
```bash
   {
     "message": "Hello from Postman!"
   }
```

4. Send the Request by clicking the Send button.

## Notes

1. You will be prompted to login first on your terminal that you run your server
2. After the first successful login, the session will be saved in session.json, and you won't need to log in again for subsequent requests.
3. Ensure your session.json file be kept safe all the times.
