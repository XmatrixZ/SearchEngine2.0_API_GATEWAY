import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtJwtStrategy, RtJwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AtJwtStrategy, RtJwtStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
