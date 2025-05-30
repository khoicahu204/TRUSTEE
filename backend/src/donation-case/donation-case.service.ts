import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationCase } from './donation-case.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';


import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

import { UpdateDonationCaseDto } from '../common/dto/update-donation-case.dto';

@Injectable()
export class DonationCaseService {
  constructor(
    @InjectRepository(DonationCase)
    private readonly caseRepo: Repository<DonationCase>,

    @InjectRepository(User)               // Thêm dòng này
    private readonly userRepo: Repository<User>,  

    @InjectRepository(DonationTransaction)    // Thêm dòng này
    private readonly donationTransactionRepo: Repository<DonationTransaction>,  // Thêm dòng này

    
  ) {}

  async createCase(
  data: {
    title: string;
    description: string;
    target_amount: number;
    images?: string[]; // danh sách URL ảnh
  },
  user: User,
) {
  const imageEntities = Array.isArray(data.images)
    ? data.images.map(url => ({ image_url: url }))
    : [];

  const newCase = this.caseRepo.create({
    title: data.title,
    description: data.description,
    target_amount: data.target_amount,
    status: 'pending',
    user,
    images: imageEntities,
  });

  return this.caseRepo.save(newCase);
}
  

  async approveCase(id: number) {
    const target = await this.caseRepo.findOneBy({ id });
    if (!target) throw new Error('Không tìm thấy case');
    target.status = 'approved';
    return this.caseRepo.save(target);
  }

  async getApprovedCases() {
    const cases = await this.caseRepo.find({
      where: { status: 'approved' },
      relations: ['donationTransactions'],
    });

    return cases.map((c) => {
      const totalDonated =
        c.donationTransactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        target_amount: c.target_amount,
        currentAmount: totalDonated,
        status: c.status,
      };
    });
  }

  

  async getCaseSummary(id: number) {
    const theCase = await this.caseRepo.findOne({
      where: { id, status: 'approved' },
      relations: ['donationTransactions'],
    });

    if (!theCase) {
      throw new NotFoundException('Không tìm thấy case đã duyệt');
    }

    const currentAmount =
      theCase.donationTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ||
      0;

    const progress = Math.min(
      Math.round((currentAmount / theCase.target_amount) * 100),
      100,
    );

    return {
      id: theCase.id,
      title: theCase.title,
      target_amount: theCase.target_amount,
      currentAmount,
      progressPercent: progress,
    };
  }

  async getCaseDetail(id: number) {
  const theCase = await this.caseRepo.findOne({
    where: { id },
    relations: ['user', 'images'], // chỉ lấy user và images thôi
  });

  if (!theCase) {
    throw new NotFoundException('Không tìm thấy case');
  }

  return theCase;
  }

  async getPendingCases() {
    return this.caseRepo.find({
      where: { status: 'pending' },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async deleteCase(id: number) {
    const caseToDelete = await this.caseRepo.findOneBy({ id });

    if (!caseToDelete) {
      throw new NotFoundException('Case không tồn tại');
    }

    await this.caseRepo.remove(caseToDelete);
    return { message: 'Xoá thành công' };
  }

  async updateCase(id: number, user: User, updates: UpdateDonationCaseDto) {
    const donationCase = await this.caseRepo.findOne({
      where: { id },
      relations: ['user'], // cần để check user
    });

    if (!donationCase) {
      throw new NotFoundException('Case không tồn tại');
    }

    if (donationCase.user.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa case này');
    }

    Object.assign(donationCase, updates);
    return this.caseRepo.save(donationCase);
  }

  async donateToCase(caseId: number, amount: number, password: string, user: User) {
    // Lấy user đầy đủ (bao gồm password)
    const userFromDb = await this.userRepo.findOne({
      where: { id: user.id },
      select: ['id', 'password', 'balance'],
    });
    if (!userFromDb) throw new UnauthorizedException('User không tồn tại');

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);
    if (!isPasswordValid) throw new UnauthorizedException('Mật khẩu không đúng');

    if (amount <= 0) throw new BadRequestException('Số tiền donate phải lớn hơn 0');

    // Lấy case kèm user tạo case
    const theCase = await this.caseRepo.findOne({
      where: { id: caseId },
      relations: ['user'],
    });
    if (!theCase) throw new NotFoundException('Case không tồn tại');

    // Kiểm tra số dư user
    if (userFromDb.balance < amount) {
      throw new BadRequestException('Số dư không đủ để donate');
    }

    // Trừ tiền user donate
    userFromDb.balance -= amount;
    await this.userRepo.save(userFromDb);

    // Cộng tiền vào tài khoản người tạo case
    theCase.user.balance += amount;
    await this.userRepo.save(theCase.user);

    // Cập nhật số tiền hiện tại của case
    theCase.current_amount += amount;
    await this.caseRepo.save(theCase);

    // Tạo giao dịch donate
    const donationTransaction = new DonationTransaction();
    donationTransaction.amount = amount;
    donationTransaction.user = userFromDb;
    donationTransaction.donationCase = theCase;
    await this.donationTransactionRepo.save(donationTransaction);

    return {
      message: 'Donate thành công',
      newBalanceDonor: userFromDb.balance,
      newBalanceCaseOwner: theCase.user.balance,
      currentAmountCase: theCase.current_amount,
    };
  }
}
