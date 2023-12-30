import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtGuardKey } from "../guard/jwt.guard.key";

@Injectable()
// the string 'jwt' must be same with AuthGuard key
export class JwtStrategy extends PassportStrategy(Strategy, JwtGuardKey) {
// This is decorator for restrict the API for auth only
    constructor (config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        });
    }

    // this is for returning user info from token
    async validate(payload: {userId: string, email: string}) {
        const user = await this.prisma.users.findUnique({where: {id: payload.userId}});

        delete user.password;
        return user;
    }
}