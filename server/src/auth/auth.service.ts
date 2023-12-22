import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    register() {
        return {msg: `I am register`};
    }

    login() {
        return {msg: `I am login`};
    }
}