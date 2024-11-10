import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  hashData(data: string) {
    return argon.hash(data);
  }
  async getSignedTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: 60 * 15,
        },
      ),

      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async updateRtHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  //TODO: Create a function called 'verifyGenrateAccessToken' to verify the accesstoken and genrate new accessToken only

  //TODO: Create a shouldGenrateBothTokens function that contains the logic to see the expiry dates
  //      By taking both accessToken and refreshToken to decide if both need be created or only access Tokens
  //      Input: accessToken,refreshToken ---> Output: (new accessToken, refreshToken) | (new accessToken, new refreshToken)

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    const tokens = await this.getSignedTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    //TODO: Check whitelist, then takes Output from the shouldGenrateBothTokens and generates Tokens and updates the dbs
    //TODO: Based on output of shouldGenrateBothTokens function call either verifyGenrateAccessToken func or getSignedTokens func
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.hash, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getSignedTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }
  //:TODO: It should take email id and  accesstoken ---> new accessToken
  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    //TODO: Check whitelist, then takes Output from the shouldGenrateBothTokens and generates Tokens and updates the dbs
    //TODO: Based on output of shouldGenrateBothTokens function call either verifyGenrateAccessToken func or getSignedTokens function
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const RtMatches = await argon.verify(user.hashedRt, refreshToken);
    if (!RtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getSignedTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async updateWhitelist(email: string) {
    // TODO: The below cash manager needs to set email as key and accessToken as value
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        whitelist: true,
      },
    });
  }
}
