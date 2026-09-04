const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const { VM } = require('vm2');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store active sessions
const sessions = new Map();

// REST API Endpoints
app.post('/api/execute', (req, res) => {
  const { code, context = {} } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: console,
        ...context,
        Math,
        Date,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean
      }
    });

    const result = vm.run(code);
    res.json({
      success: true,
      result,
      type: typeof result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

app.post('/api/validate', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    new Function(code);
    res.json({ valid: true });
  } catch (error) {
    res.json({
      valid: false,
      error: error.message
    });
  }
});

// WebSocket for real-time collaboration
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    sessions.set(sessionId, {
      users: Array.from(io.sockets.adapter.rooms.get(sessionId) || []).length,
      createdAt: new Date()
    });
    io.to(sessionId).emit('user-joined', { userId: socket.id });
  });

  socket.on('code-change', (data) => {
    const { sessionId, code } = data;
    socket.to(sessionId).emit('code-updated', { code, userId: socket.id });
  });

  socket.on('execute-code', (data) => {
    const { sessionId, code } = data;
    try {
      const vm = new VM({ timeout: 5000, sandbox: { console, Math, Date, JSON } });
      const result = vm.run(code);
      io.to(sessionId).emit('execution-result', {
        userId: socket.id,
        result,
        success: true
      });
    } catch (error) {
      io.to(sessionId).emit('execution-result', {
        userId: socket.id,
        error: error.message,
        success: false
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Sandbox server running on http://localhost:${PORT}`);
});