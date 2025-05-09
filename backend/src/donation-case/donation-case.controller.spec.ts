import { Test, TestingModule } from '@nestjs/testing';
import { DonationCaseController } from './donation-case.controller';

describe('DonationCaseController', () => {
  let controller: DonationCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationCaseController],
    }).compile();

    controller = module.get<DonationCaseController>(DonationCaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
