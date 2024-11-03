const { WebSocketServer } = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const dataGenerator = require('./dataGenerator');

let wss = null;
const clients = new Set();

// Broadcasts data to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) { // Ensure WebSocket is open
      ws.send(message);
    }
  });
}

// Updates the percentage limit and broadcasts the change.
function updatePercentageLimit(newLimit) {
  dataGenerator.updatePercentageLimit(newLimit);
  broadcast({ type: 'percentageLimitUpdate', data: newLimit });
}

// Initializes the WebSocket server.
function initializeWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true);
    const { token } = parameters.query;

    if (!token) {
      ws.close(1008, 'No token provided'); // Policy Violation
      return;
    }

    jwt.verify(token, secretKey, (err) => {
      if (err) {
        ws.close(1008, 'Invalid token'); // Policy Violation
      } else {
        clients.add(ws);

        // Send current percentage limit upon connection
        ws.send(
          JSON.stringify({ type: 'percentageLimitUpdate', data: dataGenerator.getPercentageLimit() }),
        );

        // Handle messages from client
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            if (data.type === 'updatePercentageLimit') {
              if (typeof data.value === 'number' && data.value >= 0 && data.value <= 100) {
                updatePercentageLimit(data.value);
              } else {
                // Received invalid percentageLimitUpdate
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid percentage limit value.' }));
              }
            }
          } catch (error) {
            // Error parsing message from client
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
          }
        });

        ws.on('close', () => {
          clients.delete(ws);
        });
      }
    });
  });
}

module.exports = {
  initializeWebSocket,
  broadcast,
  updatePercentageLimit,
  getClients: () => clients,
};
