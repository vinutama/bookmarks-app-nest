import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";

import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async register(dto: AuthDto) {
        // generate hash password using argon2
        const password = await argon.hash(dto.password);
        // save the user in the DB
        const user = await this.prisma.users.create({
            data: {
                email: dto.email,
                password,
            },
            // select cols to returning
            // select: {
            //     id: true,
            //     email: true,
            //     firstName: true,
            //     lastName: true,
            // }
        });

        // or just exclude the fields
        delete user.password;

        // return the user info details
        return user;
    }

    login() {
        return {msg: `I am login`};
    }
}