import { Test, TestingModule } from '@nestjs/testing';
import { KeyCloakService } from './create.service';

describe('KeyCloakService', () => {
  let service: KeyCloakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyCloakService],
    }).compile();

    service = module.get<KeyCloakService>(KeyCloakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
