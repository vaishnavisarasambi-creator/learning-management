import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json({ error: 'Validation failed', details: messages });
        return;
      }
      next(error);
    }
  };
};
