export interface ComplianceBalance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
  isBanked: boolean;
  bankedAmount?: number;
}

export class ComplianceBalanceEntity {
  static calculateCB(ghgIntensity: number, fuelConsumption: number): number {
    const TARGET_INTENSITY = 89.3368;
    const ENERGY_CONVERSION = 41000; // MJ/ton
    const energyInScope = fuelConsumption * ENERGY_CONVERSION;
    return (TARGET_INTENSITY - ghgIntensity) * energyInScope;
  }
}