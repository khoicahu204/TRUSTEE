import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy từ header Authorization
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey', // phải trùng với secret ở JwtModule
    });
  }

  async validate(payload: any) {
    // giá trị này sẽ gán vào req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}