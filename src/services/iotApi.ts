// REST client for the IoT gateway. In production this hits a Cloud Run
// service fed by Axis P3748-PLVE cameras via Pub/Sub. For the POC we
// delegate to an in-memory mockBackend so the app is runnable offline.

import { getMockLots } from './mockBackend';

export type Lot = {
  id: string;
  name: string;
  total: number;
  open: number;
  occupied: number;
  reserved: number;
  lat: number;
  lng: number;
  distanceMeters?: number;
  updatedAt: number;
  history24h: number[]; // 24 values, 0..1 utilization
};

export type LotUpdate = {
  lotId: string;
  open: number;
  occupied: number;
  reserved: number;
  ts: number;
};

export async function fetchLots(): Promise<Lot[]> {
  // Production: return fetch('https://iot.example.com/lots').then(r => r.json())
  return getMockLots();
}

export async function pollLots(): Promise<LotUpdate[]> {
  // Fallback polling endpoint
  return getMockLots().map((l) => ({
    lotId: l.id,
    open: l.open,
    occupied: l.occupied,
    reserved: l.reserved,
    ts: Date.now(),
  }));
}
