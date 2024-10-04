import dotenv from 'dotenv';
import express from 'express';

import { mongoSetup } from './database';
import { routes } from './routes';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();

mongoSetup()
  .then(() => {
    app.use(express.json());
    app.use(routes);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀️`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
