-- CreateTable
CREATE TABLE "Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" REAL NOT NULL,
    "fuelConsumption" REAL NOT NULL,
    "distance" REAL NOT NULL,
    "totalEmissions" REAL NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cbGco2eq" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "poolId" INTEGER NOT NULL,
    "shipId" TEXT NOT NULL,
    "cbBefore" REAL NOT NULL,
    "cbAfter" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "Route"("routeId");
