import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

// Only start listening when this file is run directly (not when imported by
// tests), so tests can import createApp() without starting a real server.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Website audit tool listening on port ${PORT}`);
  });
}

export default app;
