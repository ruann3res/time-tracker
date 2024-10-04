import { type Request, type Response, Router } from 'express';

import packageJson from '../package.json';

export const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  const { name, author, description, version } = packageJson;

  return res.json({ name, author, description, version });
});

