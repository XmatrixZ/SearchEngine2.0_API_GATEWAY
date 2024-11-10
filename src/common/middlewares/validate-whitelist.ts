import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class MyRedisService {
  private client: Redis;
  constructor(@Inject(RedisService) private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }
  async get(key: string): Promise<string> {
    return this.client.get(key);
  }
  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
}

@Injectable()
export class ValidatePayloadMiddleware implements NestMiddleware {
  constructor(private readonly myRedisService: MyRedisService) { }
  use(req: any, res: any, next: NextFunction) {
    try {
      const isWhitelisted = true;
      if (isWhitelisted) next();
      else throw new ForbiddenException('User Not Autherized!! Whitelisted!!!');
    } catch (err) {
      res.status(401).send('Error in Autherzing!!' + err);
    }

  }
