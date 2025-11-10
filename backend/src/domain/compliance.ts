// backend/src/domain/compliance.ts
export class Compliance {
  static TARGET_INTENSITY = 89.3368; // gCO2e/MJ
  static ENERGY_CONVERSION = 41000; // MJ per tonne

  static calculateCB(ghgIntensity: number, fuelConsumptionT: number): number {
    const energyInScope = fuelConsumptionT * this.ENERGY_CONVERSION; // MJ
    const cb = (this.TARGET_INTENSITY - ghgIntensity) * energyInScope;
    return cb; // positive => surplus, negative => deficit
  }
}
