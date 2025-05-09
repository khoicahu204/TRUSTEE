import { Test, TestingModule } from '@nestjs/testing';
import { DonationCaseService } from './donation-case.service';

describe('DonationCaseService', () => {
  let service: DonationCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationCaseService],
    }).compile();

    service = module.get<DonationCaseService>(DonationCaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
