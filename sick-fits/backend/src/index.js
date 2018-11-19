const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use Express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Decode JWT to get user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put userId on `req` for future requests to access
    req.userId = userId;
  }
  next();
});

// Create middleware to populate user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  res => {
    console.log(`Server running on http://localhost:${res.port}`);
  }
);
