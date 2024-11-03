# Real-Time Data Visualization Application

This project is a **Real-Time Data Visualization** application that displays data points both from a historical database and live updates via WebSockets. The application consists of a **Node.js** backend and a **Vue.js** frontend, providing a seamless experience for monitoring and interacting with real-time data.

## Completed excersises

- **Main task** - Done
- **1st bonus task** - Done
- **2nd bonus task** - Done
- **3rd bonus task** - Done

## Backend

### Features

- **API Endpoints**:
  - `/api/login`: Authenticates users and returns a JWT token.
  - `/api/percentage-limit`: Updates the percentage limit (protected route).
  - `/api/data-points`: Retrieves the last 15 data points from the database (protected route).
- **WebSocket Server**: Handles real-time communication with connected clients, broadcasting new data points and percentage limit updates.
- **Periodic Data Generation**: Automatically generates and stores new data points every 10 seconds, adhering to the set percentage limit.
- **SQLite Database**: Stores data points, including their value and timestamp.
- **Authentication Middleware**: Secures API routes by verifying JWT tokens.
- **CORS Configuration**: Allows cross-origin requests from the frontend.

### Technologies

- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for handling HTTP requests and routing.
- **WebSockets (ws)**: Library for enabling real-time bidirectional communication.
- **JWT (jsonwebtoken)**: For user authentication and securing API routes.
- **SQLite**: Lightweight relational database for storing data points.
- **Express Rate Limit**: Middleware to limit repeated requests and enhance security.

### Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/JanisJIvdris/Uzdevums_Latvenergo.git

   ```

2. **Navigate to the Backend Directory**:

   cd real-time-data-visualization/server

3. **Install dependencies:**

   npm install

4. **Configure Environment Variables:**
   Create a .env file in the server directory and add the following variables:

   PORT=3000
   SECRET_KEY=your_secret_key_here

- PORT: The port on which the backend server will run (default is 3000).
- SECRET_KEY: A strong secret key used for JWT token generation and verification.

5. **Initialize the Database:**
   Ensure that the SQLite database is set up correctly. The backend will automatically create the necessary tables if they do not exist.

6. **Start the Backend Server:**

   npm run start

The server will be running at http://localhost:3000/.

## Frontend

### Features

- **Real-Time Line Chart:** Displays the latest 15 data points, including 14 historical entries from the database and 1 live update.
- **Percentage Limit Control:** Allows users to set a percentage limit that influences the generation of new data points.
- **WebSocket Connection Status:** Indicates the current status of the WebSocket connection (Connected/Disconnected).
- **Responsive Design:** Ensures optimal viewing across various devices and screen sizes.
- **User Authentication:** Secures access to the dashboard, requiring users to log in with valid credentials.
- **Automatic Chart Updates:** The chart updates in real-time as new data points are received without needing a page refresh.

### Technologies

- **Vue.js:** Frontend framework for building interactive user interfaces.
- **Chart.js:** JavaScript library for data visualization.
- **WebSockets:** Enables real-time communication between the client and server.
- **CSS:** Styling the application with a clean and responsive layout.

### Instructions

1. **Navigate to the frontend directory:**

   cd real-time-data-visualization/client

2. **Install Dependencies:**

   npm install

3.**Start the Development Server:**

npm run serve

The application will be available at http://localhost:8080/.

Note: Ensure that the backend server is running (http://localhost:3000/) before starting the frontend to allow successful API and WebSocket connections.

## Running the Application

1. **Ensure Both Frontend and Backend Are Running:**

   - Backend: http://localhost:3000/
   - Frontend: http://localhost:8080/

2. **Access the application:**
   Open your browser and navigate to http://localhost:8080/.

3. **Login**

Use default creditentials to log in:

- Username: admin
- Password: admin

4. **Interact with the Dashboard:**
   After logging in, you can:

- View Data Points: Observe the line chart displaying historical and live data points.
- Set Percentage Limit: Adjust the percentage limit to influence data point generation.
- Monitor WebSocket Status: Check the connection status indicator to ensure real-time updates are functioning.

## Potential Improvements

- Error handling currently is very basic and should be improved.
- Implement user registration and role-based access control.
- Database solution could be improved to more scalable solution.
