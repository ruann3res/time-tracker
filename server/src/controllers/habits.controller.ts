import dayjs from 'dayjs';
import { response, type Request, type Response } from 'express';
import { z } from 'zod';

import { habitModel } from '../model/habit.model';
import { buildValidationErrorMessage } from '../utils/errors/build-validation-erro-message';

export class HabitsController {
  store = async (req: Request, res: Response): Promise<Response> => {
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

    const habitAlreadyExists = await habitModel.findOne({
      name: validBody.data.name,
    });

    if (habitAlreadyExists) {
      return res.status(400).json({ message: 'Habit already exists' });
    }

    await habitModel.create({
      name: validBody.data.name,
      completedDates: [],
    });

    return res.status(201).send();
  };

  index = async (req: Request, res: Response): Promise<Response> => {
    const habits = await habitModel.find().sort({ name: 1 });
    return res.status(200).json({ data: habits });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const schema = z.object({
      id: z.string(),
    });

    const validParams = schema.safeParse(req.params);

    if (!validParams.success) {
      const errors = buildValidationErrorMessage(validParams.error.issues);

      return res.status(422).json({
        message: errors,
      });
    }

    const findHabit = await habitModel.findOne({
      _id: validParams.data.id,
    });

    if (!findHabit) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    await habitModel.deleteOne({
      _id: validParams.data.id,
    });

    return res.status(204).send();
  };

  toggle = async (req: Request, res: Response): Promise<Response> => {
    const schema = z.object({
      id: z.string(),
    });

    const validParams = schema.safeParse(req.params);

    if (!validParams.success) {
      const errors = buildValidationErrorMessage(validParams.error.issues);
      return res.status(422).json({ message: errors });
    }

    const findHabit = await habitModel.findOne({
      _id: validParams.data.id,
    });

    if (!findHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const now = dayjs().startOf('day').toISOString();

    const isHabitCompletedOnDate = findHabit
      .toObject()
      ?.completedDates.find(
        (item) => dayjs(String(item)).toISOString() === now,
      );

    if (isHabitCompletedOnDate) {
      const habitUpdated = await habitModel.findOneAndUpdate(
        {
          _id: validParams.data.id,
        },
        {
          $pull: {
            completedDates: now,
          },
        },
        {
          returnDocument: 'after',
        },
      );

      return res.status(200).json(habitUpdated);
    }

    const habitUpdated = await habitModel.findOneAndUpdate(
      {
        _id: validParams.data.id,
      },
      {
        $push: {
          completedDates: now,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    return res.status(200).json(habitUpdated);
  };
}
