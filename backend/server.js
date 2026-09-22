import 'dotenv/config';
import { app } from './app.js';

const PORT = Number(process.env.PORT || 5000);

// Start the Express API server for local development.
app.listen(PORT, () => {
  console.log(`FresherAI backend running on http://localhost:${PORT}`);
});
