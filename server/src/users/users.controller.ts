import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUserLogin } from '../custom-decorators';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersService } from './users.service';

//use guard from wrap authorization
// it can be in controller level or route level
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get()
    getUser(@GetUserLogin() user: Users) {
        return user;
    }

    @Patch()
    editUser(@GetUserLogin('id') userId: string, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
