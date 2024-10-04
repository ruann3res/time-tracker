import express, { type Request, type Response } from 'express';

const app = express();

app.listen(4000, () => {
  console.log('Ola mundo');
});

app.get('/', (req: Request, res: Response) => {
  res.json({ ola: 'mundo' });
});
