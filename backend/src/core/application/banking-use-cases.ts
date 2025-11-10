import { ComplianceBalance } from '../domain/compliance.js';

export interface IBankingRepository {
  bankSurplus(shipId: string, year: number, amount: number): Promise<void>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
  getBankedAmount(shipId: string, year: number): Promise<number>;
}

export class BankingUseCases {
  constructor(private bankingRepo: IBankingRepository) {}

  async bankComplianceBalance(shipId: string, year: number, amount: number): Promise<void> {
    if (amount <= 0) throw new Error('Banking amount must be positive');
    return this.bankingRepo.bankSurplus(shipId, year, amount);
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number): Promise<void> {
    const available = await this.bankingRepo.getBankedAmount(shipId, year);
    if (amount > available) throw new Error('Insufficient banked amount');
    return this.bankingRepo.applyBanked(shipId, year, amount);
  }
}