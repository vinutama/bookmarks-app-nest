import { AuthGuard } from "@nestjs/passport";
import { JwtGuardKey } from "./jwt.guard.key";
;

export class JwtGuard extends AuthGuard(JwtGuardKey) {
    constructor() {
        super();
    }
}