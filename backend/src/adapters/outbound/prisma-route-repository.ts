import { IRouteRepository } from '../../core/ports/route-repository.port';
import { Route } from '../../core/domain/route';
import { PrismaClient } from '@prisma/client';

export class PrismaRouteRepository implements IRouteRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany();
    return routes.map(this.toDomain);
  }

  async setBaseline(routeId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.route.updateMany({ where: { isBaseline: true }, data: { isBaseline: false } }),
      this.prisma.route.update({ where: { routeId }, data: { isBaseline: true } })
    ]);
  }

  async findComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }> {
    const routes = await this.prisma.route.findMany();
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) throw new Error('No baseline route found');
    return { baseline: this.toDomain(baseline), comparisons: routes.filter(r => !r.isBaseline).map(this.toDomain) };
  }

  private toDomain(prismaRoute: any): Route {
    return { id: prismaRoute.id, routeId: prismaRoute.routeId, vesselType: prismaRoute.vesselType, fuelType: prismaRoute.fuelType, year: prismaRoute.year, ghgIntensity: prismaRoute.ghgIntensity, fuelConsumption: prismaRoute.fuelConsumption, distance: prismaRoute.distance, totalEmissions: prismaRoute.totalEmissions, isBaseline: prismaRoute.isBaseline };
  }
}