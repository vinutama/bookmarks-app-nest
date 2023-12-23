import { Controller, Get, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetUserLogin } from 'src/custom-decorators';

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
