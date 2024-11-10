import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('info')
  GetUserInfo(@GetCurrentUser() user: User) {
    return user;
  }

  @Patch('edit')
  EditUserInfo(
    @GetCurrentUser('sub') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUserinfo(userId, dto);
  }
}
