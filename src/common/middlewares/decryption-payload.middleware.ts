import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class DecryptPayloadMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const encryptedPayload = req.body.encryptedPayload;
      const decryptedPayload = this.decrypt(encryptedPayload);
      req.body = decryptedPayload;
      next();
    } catch (err) {
      res.status(400).send('Invalid Payload'); // Handle error (invalid payload, decryption failure, etc.)
    }
  }

  decrypt(encryptedPayload: string) {
    const algorithm = this.config.get('ALGORITHM');
    const DECRYPT_SECRET_KEY = this.config.get('DECRYPT_SECRET_KEY');
    const DECRYPT_IV = this.config.get('DECRYPT_IV');

    const key = Buffer.from(DECRYPT_SECRET_KEY, 'hex');
    const iv = Buffer.from(DECRYPT_IV, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decryptedPayload = decipher.update(encryptedPayload, 'hex', 'utf8');
    return JSON.parse(decryptedPayload);
  }
}
