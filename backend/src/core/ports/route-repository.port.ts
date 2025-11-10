import { Route } from '../domain/route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  findComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }>;
}