import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationCase } from './donation-case.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

import { UpdateDonationCaseDto } from '../common/dto/update-donation-case.dto';

@Injectable()
export class DonationCaseService {
  constructor(
    @InjectRepository(DonationCase)
    private readonly caseRepo: Repository<DonationCase>,
    @InjectRepository(DonationTransaction)
    private readonly txRepo: Repository<DonationTransaction>,
  ) {}

  async createCase(
    data: { title: string; description: string; goalAmount: number },
    user: User,
  ) {
    const newCase = this.caseRepo.create({
      ...data,
      createdBy: user,
    });
    return this.caseRepo.save(newCase);
  }

  async donateToCase(caseId: number, amount: number, user: User) {
    const donationCase = await this.caseRepo.findOneBy({ id: caseId });
    if (!donationCase) throw new Error('Không tìm thấy case');

    const transaction = this.txRepo.create({
      amount,
      donor: user,
      donationCase,
    });

    return this.txRepo.save(transaction);
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
        goalAmount: c.goalAmount,
        currentAmount: totalDonated,
        status: c.status,
      };
    });
  }

  async getCaseDetail(id: number) {
    const caseData = await this.caseRepo.findOne({
      where: { id },
      relations: [
        'createdBy',
        'donationTransactions',
        'donationTransactions.donor',
      ],
    });

    if (!caseData) {
      throw new NotFoundException('Không tìm thấy case này');
    }

    return caseData;
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
      Math.round((currentAmount / theCase.goalAmount) * 100),
      100,
    );

    return {
      id: theCase.id,
      title: theCase.title,
      goalAmount: theCase.goalAmount,
      currentAmount,
      progressPercent: progress,
    };
  }

  async getPendingCases() {
    return this.caseRepo.find({
      where: { status: 'pending' },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
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
      relations: ['createdBy'], // cần để check user
    });

    if (!donationCase) {
      throw new NotFoundException('Case không tồn tại');
    }

    if (donationCase.createdBy.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa case này');
    }

    Object.assign(donationCase, updates);
    return this.caseRepo.save(donationCase);
  }
}
