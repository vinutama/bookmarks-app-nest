import { Controller, Get, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { GetUserLogin } from '../../src/custom-decorators';
import { JwtGuard } from '../auth/guard/jwt.guard';

//use guard from wrap authorization
// it can be in controller level or route level
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    @Get()
    getUser(@GetUserLogin() user: Users) {
        return user;
    }
}
