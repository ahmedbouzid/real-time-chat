import { Test, TestingModule } from '@nestjs/testing';
import { UserHeplerService } from './user-hepler.service';

describe('UserHeplerService', () => {
  let service: UserHeplerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHeplerService],
    }).compile();

    service = module.get<UserHeplerService>(UserHeplerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
