import { IRouteRepository } from '../ports/route-repository.port.js';
import { Route } from '../domain/route.js';

export class RouteUseCases {
  constructor(private routeRepository: IRouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async setBaselineRoute(routeId: string): Promise<void> {
    return this.routeRepository.setBaseline(routeId);
  }

  async getComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }> {
    return this.routeRepository.findComparisonData();
  }
}