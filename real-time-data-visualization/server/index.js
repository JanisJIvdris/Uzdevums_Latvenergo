const express = require('express');
const http = require('http');
const cors = require('cors');
const { port } = require('./config');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const percentageLimitRoutes = require('./routes/percentageLimit');
const dataPointsRoutes = require('./routes/dataPoints');
const websocketService = require('./services/websocket');
const dataGenerator = require('./services/dataGenerator');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', percentageLimitRoutes);
app.use('/api', dataPointsRoutes);

// Start HTTP server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Initialize WebSocket server
websocketService.initializeWebSocket(server);

// Generate and send random numbers every 10 seconds
setInterval(() => {
  const dataPoint = dataGenerator.generateRandomNumber();
  websocketService.broadcast({ type: 'dataPoint', data: dataPoint });
}, 10000);
