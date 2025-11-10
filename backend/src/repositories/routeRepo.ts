// backend/src/repositories/routeRepo.ts
import prisma from '../prismaClient';

export const RouteRepo = {
  async findAll() {
    return prisma.route.findMany({ orderBy: { id: 'asc' } });
  },

  async findByRouteId(routeId: string) {
    return prisma.route.findUnique({ where: { routeId } });
  },

  async setBaseline(routeId: string) {
    // set all others false, set this true
    await prisma.route.updateMany({ where: {}, data: { isBaseline: false } });
    const updated = await prisma.route.update({ where: { routeId }, data: { isBaseline: true }});
    return updated;
  },

  async findBaseline(year?: number) {
    if (year) {
      return prisma.route.findFirst({ where: { isBaseline: true, year }});
    }
    return prisma.route.findFirst({ where: { isBaseline: true }});
  },

  async findComparisons(baselineRouteId?: string) {
    const baseline = baselineRouteId ? await prisma.route.findUnique({ where: { routeId: baselineRouteId }}) : await prisma.route.findFirst({ where: { isBaseline: true }});
    const comps = await prisma.route.findMany({ where: { NOT: { routeId: baseline?.routeId } } });
    return { baseline, comparisons: comps };
  }
};
