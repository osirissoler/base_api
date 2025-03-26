import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validarFields = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
    return;
  }

  next();
};

export { validarFields };
