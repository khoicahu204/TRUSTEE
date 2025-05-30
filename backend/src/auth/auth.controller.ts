import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  Get,
  ValidationPipe,
  BadRequestException,
  UnauthorizedException,

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User as UserDecorator } from '../common/decorators/user.decorator'; // tránh trùng với entity
import { RegisterDto, LoginDto } from '../common/dto/auth.dto';

import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



console.log('📡 AuthController loaded');

@Controller('auth') // Base route: /auth
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService
  ) {}

  @Post('register') // Route: POST /auth/register
  register(@Body(new ValidationPipe()) body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@UserDecorator() user: any) {
    return user; // được gán từ hàm validate trong JwtStrategy
  }


  @Patch('user/deposit')
@UseGuards(AuthGuard('jwt'))
async deposit(
  @Body() body: { amount: number; password: string },
  @UserDecorator() user: User,
) {
  if (body.amount <= 0) {
    throw new BadRequestException('Số tiền phải lớn hơn 0');
  }

  const userFromDb = await this.userRepo.findOne({
    where: { id: user.id },
    select: ['password', 'id', 'balance', 'email', 'name', 'role'], // nhớ thêm trường bạn cần
  });

  if (!userFromDb) {
    throw new UnauthorizedException('User not found');
  }

  const isPasswordValid = await bcrypt.compare(body.password, userFromDb.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Mật khẩu không đúng');
  }

  userFromDb.balance += body.amount;
  await this.userRepo.save(userFromDb);

  return { message: 'Nạp tiền thành công', balance: userFromDb.balance };
}

@Get('user/donated-cases')
@UseGuards(AuthGuard('jwt'))
getDonatedCases(@UserDecorator() user: User) {
  return this.authService.getCasesUserDonated(user);
}

@Get('user/my-cases')
@UseGuards(AuthGuard('jwt'))
getMyCases(@UserDecorator() user: User) {
  return this.authService.getCasesCreatedByUser(user);
}


}
