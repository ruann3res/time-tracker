import { type Request, type Response, Router } from 'express';

import packageJson from '../package.json';
import { HabitsController } from './controllers/habits.controller';

export const routes = Router();

const habitsController = new HabitsController();

routes.get('/', (req: Request, res: Response) => {
  const { name, author, description, version } = packageJson;

  return res.json({ name, author, description, version });
});

routes.post('/habits', habitsController.store);
routes.get('/habits', habitsController.index);
routes.delete('/habits/:id', habitsController.delete);
routes.patch('/habits/:id/toggle', habitsController.toggle);
