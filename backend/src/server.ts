// ✅ Added validation and final banking/pooling logic
// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import prisma from './prismaClient';
import { RouteRepo } from './repositories/routeRepo';
import { BankingRepo } from './repositories/bankingRepo';
import { Compliance } from './domain/compliance';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚢 FuelEU Backend is running successfully!');
});

// ✅ Health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ✅ GET /api/routes
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await RouteRepo.findAll();
    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/routes/:routeId/baseline
app.post('/api/routes/:routeId/baseline', async (req, res) => {
  const routeId = req.params.routeId;
  try {
    const updated = await RouteRepo.setBaseline(routeId);
    res.json({ message: 'Baseline set', route: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /api/routes/comparison
app.get('/api/routes/comparison', async (req, res) => {
  try {
    const { baseline, comparisons } = await RouteRepo.findComparisons();
    if (!baseline) return res.status(404).json({ error: 'No baseline set' });

    const comparisonsWithMeta = comparisons.map((c) => {
      const percentDiff = ((c.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = c.ghgIntensity <= baseline.ghgIntensity;
      return {
        id: c.id,
        routeId: c.routeId,
        ghgIntensity: c.ghgIntensity,
        percentDiff: Number(percentDiff.toFixed(4)),
        compliant,
      };
    });

    res.json({
      baseline: { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity },
      comparisons: comparisonsWithMeta,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/compliance/cb?shipId=R001&year=2024
app.get('/api/compliance/cb', async (req, res) => {
  const shipId = String(req.query.shipId || '');
  const year = Number(req.query.year || 0);
  if (!shipId || !year)
    return res.status(400).json({ error: 'shipId and year required' });

  const route = await RouteRepo.findByRouteId(shipId);
  if (!route) return res.status(404).json({ error: 'Route not found' });

  const cb = Compliance.calculateCB(route.ghgIntensity, route.fuelConsumption);
  await prisma.shipCompliance.create({ data: { shipId, year, cbGco2eq: cb } });

  res.json({ shipId, year, cbGco2eq: cb });
});

// ✅ GET /api/compliance/adjusted-cb
app.get('/api/compliance/adjusted-cb', async (req, res) => {
  const shipId = String(req.query.shipId || '');
  const year = Number(req.query.year || 0);
  if (!shipId || !year)
    return res.status(400).json({ error: 'shipId and year required' });

  const route = await RouteRepo.findByRouteId(shipId);
  if (!route) return res.status(404).json({ error: 'Route not found' });

  const cb = Compliance.calculateCB(route.ghgIntensity, route.fuelConsumption);
  const banked = await BankingRepo.getBankedAmount(shipId, year);
  const adjusted = cb + banked;
  res.json({ shipId, year, cb_before: cb, banked, cb_after: adjusted });
});

// ✅ GET /api/banking/records
app.get('/api/banking/records', async (req, res) => {
  const shipId = String(req.query.shipId || '');
  const year = Number(req.query.year || 0);
  if (!shipId || !year)
    return res.status(400).json({ error: 'shipId and year required' });

  const records = await BankingRepo.getRecords(shipId, year);
  res.json({ shipId, year, records });
});

// ✅ POST /api/banking/bank
app.post('/api/banking/bank', async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== 'number')
    return res
      .status(400)
      .json({ error: 'shipId, year, and amount are required' });

  const route = await RouteRepo.findByRouteId(shipId);
  if (!route) return res.status(404).json({ error: 'Route not found' });

  const cb = Compliance.calculateCB(route.ghgIntensity, route.fuelConsumption);
  if (cb <= 0) return res.status(400).json({ error: 'No surplus to bank' });
  if (amount > cb)
    return res.status(400).json({ error: 'Cannot bank more than CB' });

  const entry = await BankingRepo.createBankEntry(shipId, year, amount);
  res.json({ message: 'Banked successfully', entry });
});

// ✅ POST /api/banking/apply
app.post('/api/banking/apply', async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== 'number')
    return res
      .status(400)
      .json({ error: 'shipId, year, and amount are required' });

  const available = await BankingRepo.getBankedAmount(shipId, year);
  if (amount > available)
    return res
      .status(400)
      .json({ error: 'Apply amount exceeds banked balance' });

  const entry = await BankingRepo.createApplyEntry(shipId, year, amount);
  res.json({ message: 'Applied successfully', entry });
});

// ✅ POST /api/pools
app.post('/api/pools', async (req, res) => {
  const { year, members } = req.body;
  if (!year || !Array.isArray(members))
    return res.status(400).json({ error: 'year and members required' });

  const total = members.reduce(
    (s: number, m: any) => s + Number(m.cbBefore || 0),
    0
  );
  if (total < 0) return res.status(400).json({ error: 'Total CB must be >= 0' });

  const result = members.map((m: any) => ({
    shipId: m.shipId,
    cbBefore: Number(m.cbBefore),
    cbAfter: Number(m.cbBefore),
  }));

  const surpluses = result
    .filter((r) => r.cbBefore > 0)
    .sort((a, b) => b.cbBefore - a.cbBefore);
  const deficits = result
    .filter((r) => r.cbBefore < 0)
    .sort((a, b) => a.cbBefore - b.cbBefore);

  let sIndex = 0;
  for (const def of deficits) {
    let deficit = -def.cbBefore;
    while (deficit > 0 && sIndex < surpluses.length) {
      const sup = surpluses[sIndex];
      const available = result.find((r) => r.shipId === sup.shipId)!.cbAfter;
      const take = Math.min(available, deficit);
      result.find((r) => r.shipId === sup.shipId)!.cbAfter -= take;
      result.find((r) => r.shipId === def.shipId)!.cbAfter += take;
      deficit -= take;
      if (result.find((r) => r.shipId === sup.shipId)!.cbAfter <= 0) sIndex++;
    }
    if (deficit > 0)
      return res.status(400).json({ error: 'Unable to allocate fully — invalid pool' });
  }

  const pool = await prisma.pool.create({ data: { year } });
  for (const r of result) {
    await prisma.poolMember.create({
      data: {
        poolId: pool.id,
        shipId: r.shipId,
        cbBefore: r.cbBefore,
        cbAfter: r.cbAfter,
      },
    });
  }

  res.json({ year, total, members: result });
});

// ✅ Export app for testing
export default app;

// ✅ Only start server in non-test environments
if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
  });
}
