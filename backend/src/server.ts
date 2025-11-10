const express = require('express');
const cors = require('cors');
const { PrismaRouteRepository } = require('./adapters/outbound/prisma-route-repository');
const { RouteUseCases } = require('./core/application/route-use-cases');
const { BankingUseCases } = require('./core/application/banking-use-cases');
const { PrismaBankingRepository } = require('./adapters/outbound/prisma-banking-repository');

const app = express();
app.use(cors());
app.use(express.json());

const routeRepository = new PrismaRouteRepository();
const routeUseCases = new RouteUseCases(routeRepository);
const bankingRepo = new PrismaBankingRepository();
const bankingUseCases = new BankingUseCases(bankingRepo);

import { Request, Response } from 'express';

app.get('/api/routes', async (req: Request, res: Response) => {
  try {
    const routes = await routeUseCases.getAllRoutes();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

app.post('/api/routes/:routeId/baseline', async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;
    await routeUseCases.setBaselineRoute(routeId);
    res.json({ message: 'Baseline set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set baseline' });
  }
});

app.get('/api/routes/comparison', async (req: Request, res: Response) => {
  try {
    const comparisonData = await routeUseCases.getComparisonData();
    const targetIntensity = 89.3368;
    
    const comparisons = comparisonData.comparisons.map((route: any) => {
      const percentDiff = ((route.ghgIntensity / comparisonData.baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= targetIntensity;
      
      return {
        ...route,
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant
      };
    });

    res.json({
      baseline: comparisonData.baseline,
      comparisons,
      targetIntensity
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comparison data' });
  }
});

app.get('/api/compliance/cb', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;
    const mockCB = {
      shipId: shipId || 'R001',
      year: parseInt(year as string) || 2024,
      cbGco2eq: 150000,
      isBanked: false
    };
    res.json(mockCB);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance balance' });
  }
});

app.post('/api/banking/bank', async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;
    await bankingUseCases.bankComplianceBalance(shipId, year, amount);
    res.json({ message: 'Successfully banked compliance balance' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/banking/apply', async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;
    await bankingUseCases.applyBankedSurplus(shipId, year, amount);
    res.json({ message: 'Successfully applied banked surplus' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});