class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = [];
    this.statusListeners = [];
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error(
        'No token found. Unable to establish WebSocket connection.',
      );
      return;
    }

    if (
      this.socket
      && (this.socket.readyState === WebSocket.OPEN || this.isConnecting)
    ) {
      console.warn('WebSocket is already connected or connecting.');
      return;
    }

    // Reset socket if it's closing or closed
    if (
      this.socket
      && (this.socket.readyState === WebSocket.CLOSING
        || this.socket.readyState === WebSocket.CLOSED)
    ) {
      this.socket = null;
    }

    this.isConnecting = true;

    this.socket = new WebSocket(
      `ws://localhost:3000/?token=${token}`,
    );

    this.socket.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.statusListeners.forEach((listener) => listener(true));
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error.message);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = (event) => {
      this.isConnecting = false;
      this.statusListeners.forEach((listener) => listener(false));

      // Do not reconnect if token is invalid
      if (event.code === 1008) {
        console.error('Invalid token. Cannot reconnect.');
        return;
      }

      // Exponential backoff for reconnection attempts
      this.reconnectAttempts += 1;
      const delay = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);

      setTimeout(() => {
        this.connect();
      }, delay);
    };
  }

  onMessage(listener) {
    this.listeners.push(listener);
  }

  onConnectionStatusChange(listener) {
    this.statusListeners.push(listener);
  }

  removeMessageListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  removeStatusListener(listener) {
    this.statusListeners = this.statusListeners.filter((l) => l !== listener);
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
