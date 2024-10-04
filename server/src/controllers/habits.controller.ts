import { type Request, type Response } from 'express';
import { z } from 'zod';

import { habitModel } from '../model/habit.model';
import { buildValidationErrorMessage } from '../utils/errors/build-validation-erro-message';

export class HabitsController {
  store = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
    });

    const { name } = req.body;
    const validBody = schema.safeParse({ name });

    if (!validBody.success) {
      const errors = buildValidationErrorMessage(validBody.error.issues);

      return res.status(422).json({
        message: errors,
      });
    }

    const findHabit = await habitModel.findOne({
      name: validBody.data.name,
    });

    if (findHabit) {
      res.status(400).json({ message: 'Habit already exists' });
    }

    await habitModel.create({
      name: validBody.data.name,
      completedDates: [],
    });

    return res.status(201).send();
  };
}
