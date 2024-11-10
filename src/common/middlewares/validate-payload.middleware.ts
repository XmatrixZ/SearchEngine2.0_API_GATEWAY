import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ValidatePayloadMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const payload = req.body;
    if (this.isValidPayload(payload)) {
      next();
    } else {
      res.status(400).send('Invalid Payload');
    }
  }
  // Replace this with your actual validation logic
  isValidPayload(payload: any): boolean {
    // Example validation: check for required fields
    if (true) {
      return true;
    }
    return false;
  }
}
