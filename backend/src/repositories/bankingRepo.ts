// backend/src/repositories/bankingRepo.ts
import prisma from '../prismaClient';

export const BankingRepo = {
  async createBankEntry(shipId: string, year: number, amount: number) {
    return prisma.bankEntry.create({ data: { shipId, year, amount, type: 'BANK' }});
  },

  async createApplyEntry(shipId: string, year: number, amount: number) {
    return prisma.bankEntry.create({ data: { shipId, year, amount, type: 'APPLY' }});
  },

  async getBankedAmount(shipId: string, year: number) {
    const bankSum = await prisma.bankEntry.aggregate({
      where: { shipId, year, type: 'BANK' },
      _sum: { amount: true }
    });
    const applySum = await prisma.bankEntry.aggregate({
      where: { shipId, year, type: 'APPLY' },
      _sum: { amount: true }
    });
    const banked = (bankSum._sum.amount || 0) - (applySum._sum.amount || 0);
    return banked;
  },

  async getRecords(shipId: string, year: number) {
    return prisma.bankEntry.findMany({ where: { shipId, year }, orderBy: { createdAt: 'desc' }});
  }
};
