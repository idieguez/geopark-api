// Define environment variables needed for tests.

// Environment.
process.env.ENV = 'TEST';

// Application.
process.env.APP_PORT = '3001';

// CORS.
process.env.CORS_ORIGIN = 'http://127.0.0.1:3000';

// Rate Limit.
process.env.RL_GENERAL_MIN = '10';
process.env.RL_GENERAL_NREQ = '1000'; // High limit for tests.
process.env.RL_AUTH_MIN = '10';
process.env.RL_AUTH_NREQ = '1000'; // High limit for tests.

// Login Attempts.
process.env.LA_MAX_ATTEMPTS = '5';
process.env.LA_LOCK_TIME = '30';

// JWT.
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
