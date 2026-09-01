import express from 'express';
import cors from 'cors';
import { config, prisma } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
if (config.nodeEnv === 'development' && process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// API Routes
app.use('/api', routes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    error: 'NotFound',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start HTTP Server
export function startServer(port = config.port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Zevota REST API server running at http://localhost:${port}`);
    console.log(`📡 Environment: ${config.nodeEnv}`);
    console.log(`📦 Database: Connected via Prisma`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use by another process.`);
      console.error(`👉 Run 'Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force' or set PORT in .env`);
    } else {
      console.error('Server error:', err);
    }
  });

  const shutdown = async () => {
    console.log('Shutting down server gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Prisma disconnected. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  return server;
}

export default app;
