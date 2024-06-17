# Meeting Hub

Meeting Hub is a real-time meeting web application, designed to facilitate virtual meetings similar to Google Meet and Zoom. Built on the MERN stack, this project leverages Socket.io and WebRTC to provide seamless real-time communication and collaboration.

## Live Demo

Check out the live demo of Meeting Hub: [Meeting Hub Live](https://meeting-hub-client.onrender.com)

## Tech Stack

- **Frontend**:

  - React.js

- **Backend**:

  - Node.js
  - Express.js

- **Database**:

  - MongoDB

- **Real-Time Communication**:

  - Socket.io
  - WebRTC

- **Authentication**:
  - JSON Web Token (JWT)

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/meeting-hub.git
   cd meeting-hub
   ```

2. **Install Dependencies**:

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. **Configure Environment Variables**:

   Create a .env file in the server directory and add your MongoDB URI and other required environment variables:

   ```bash
   PORT=8000
   JWT_SECRET_KEY=Your_jwt_secred_key
   DATABASE_URL=your_database_url
   ```

   Create a .env file in the client directory and add your MongoDB URI and other required environment variables:

   ```bash
   VITE_APP_SERVER_URL=http://localhost:8000
   VITE_APP_URL=http://localhost:5173
   VITE_APP_CLINT_ID =your_google_auth_id
   ```

4. **Start The Application**:

   ```bash
   # Start the server
   cd server
   npm start

   # Start the client
   cd client
   npm run dev
   ```

5. **Access The Application**:

   Open your browser and go to `http://localhost:5173`
