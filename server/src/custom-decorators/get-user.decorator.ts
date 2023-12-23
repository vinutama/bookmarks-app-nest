import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserLogin = createParamDecorator(
  (data : string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return {[data]: request.user[data]};
    }
    return request.user;
  },
);