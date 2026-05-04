# OTP Verification API (Node.js + Express)

This project is a simple backend API for phone number verification using OTP (One-Time Password). It allows users to request an OTP and verify it to receive a JWT token.

---

## Features

- Send OTP to a phone number
- Verify OTP with expiry and attempt limits
- JWT authentication after successful verification
- MongoDB for data storage
- Input validation using Joi
- Clean and modular code structure

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Joi (validation)
- JSON Web Token (JWT)
- Twilio (optional for SMS)

---

## Project Setup

### 1. Clone the repository

git clone <your-repo-url>
cd otp-verification-api

---

### 2. Install dependencies

npm install

---

### 3. Environment variables

Create a `.env` file in the root folder and add:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/otpdb
JWT_SECRET=your_jwt_secret

add your test account creds.
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx  
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1xxxxxxxxxx

---

### 4. Run the project

npm run dev

Server will start on:
http://localhost:5000

---

## API Endpoints

### Send OTP

POST /auth/send-otp

Request body:

{
"phone": "+919876543210"
}

Response:

{
"message": "OTP sent successfully"
}

---

### Verify OTP

POST /auth/verify-otp

Request body:

{
"phone": "+919876543210",
"otp": "123456"
}

Response:

{
"token": "jwt_token",
"verified": true
}

---

### Protected Route Example

GET /user/profile

Headers:

Authorization: Bearer <token>

---

## OTP Rules

- OTP expires in 2 minutes
- Maximum 3 verification attempts allowed
- New OTP overwrites the previous one

---

## Notes

- If Twilio is not configured, OTP will be logged in the console
- Make sure MongoDB is running locally
- Do not commit your `.env` file

---

## Folder Structure

/controllers
/models
/routes
/services
/middleware
/utils

server.js
