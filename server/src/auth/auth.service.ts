import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async register(dto: AuthDto) {
        // generate hash password using argon2
        const password = await argon.hash(dto.password);
        
        // save the user in the DB
        try {
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
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                // check error message code here
                // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
                if (error.code == 'P2002'){
                    throw new ForbiddenException('Email already taken');
                }
            }
            throw error;
        }
    }

    login() {
        return {msg: `I am login`};
    }
}