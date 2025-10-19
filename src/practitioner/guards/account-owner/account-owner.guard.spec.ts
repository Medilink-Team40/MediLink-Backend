import { AccountOwnerGuard } from './account-owner.guard';

describe('AccountOwnerGuard', () => {
  it('should be defined', () => {
    expect(new AccountOwnerGuard()).toBeDefined();
  });
});
