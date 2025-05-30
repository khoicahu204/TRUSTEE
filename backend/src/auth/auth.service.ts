import { Injectable, ConflictException, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';
import { DonationCase } from '../donation-case/donation-case.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly jwtService: JwtService,

    @InjectRepository(DonationCase)
    private readonly caseRepo: Repository<DonationCase>,

    @InjectRepository(DonationTransaction)
    private readonly donationTransactionRepo: Repository<DonationTransaction>,
  ) {}

  async register(data: { name: string; email: string; password: string; avatar_url?: string; }) {
    const existing = await this.userRepo.findOneBy({ email: data.email });
    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepo.create({ ...data, password: hashed });
    return this.userRepo.save(newUser);
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) throw new UnauthorizedException('Email không đúng');
  
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');
  
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async deposit(user: User, amount: number, password: string) {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền phải lớn hơn 0');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    user.balance += amount;
    await this.userRepo.save(user);

    return { message: 'Nạp tiền thành công', balance: user.balance };
  }
  
  async getCasesCreatedByUser(user: User) {
    return this.caseRepo.find({
      where: { user: { id: user.id } },
    });
  }

  async getCasesUserDonated(user: User) {
  const transactions = await this.donationTransactionRepo.find({
    where: { user: { id: user.id } },
    relations: ['donationCase'],
  });

  // Lấy các case duy nhất user đã donate
  const uniqueCases = [...new Map(transactions.map(tx => [tx.donationCase.id, tx.donationCase])).values()];
  return uniqueCases;
  }

  



  
}