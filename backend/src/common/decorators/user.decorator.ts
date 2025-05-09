import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator để lấy req.user ra khỏi request
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();

    // 👇 trả về thông tin người dùng đã đăng nhập
    return request.user;
  },
);