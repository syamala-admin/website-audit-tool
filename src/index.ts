import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

// Application bootstrap: conditional logic ensures the HTTP listener only
// starts when this file is executed directly, not when it is imported
// (e.g. by tests importing createApp()).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`website-audit-tool service listening on port ${PORT}`);
  });
}

export default app;
