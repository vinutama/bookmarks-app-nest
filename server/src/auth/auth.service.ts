import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AuthDto } from "./dto";

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}

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
    
            return this.genToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // check error message code here
                // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
                if (error.code == 'P2002'){
                    throw new ForbiddenException('Email already taken');
                }
            }
            throw error;
        }
    }

    async login(dto: AuthDto) {
        // find user by email input
        // validate email does not exist
        const user = await this.prisma.users.findUnique({
            where: {email: dto.email}
        });

        if (!user) 
        throw new NotFoundException('Email does not exist / not registered yet');
        
        
        // validate password
        await this.validatePassword(dto.password, user.password);

        // generate jwt token
        return this.genToken(user.id, user.email);
    }

    async validatePassword(password: string, hashedPassword: string) {
        const passwordMatches = await argon.verify(hashedPassword, password);

        if (!passwordMatches)
        throw new ForbiddenException('Wrong password, please check your password again');
    }

    async genToken(userId: number, email: string): Promise<{access_token: string}> {
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync({userId, email}, 
        {
            expiresIn: '20m', 
            secret
        });

        return {access_token: token};
    }
}