import type { Lot, LotUpdate } from './iotApi';

const state: Lot[] = [
  {
    id: 'lot_north',
    name: 'North Campus Garage',
    total: 420,
    open: 83,
    occupied: 330,
    reserved: 7,
    lat: 37.875,
    lng: -122.259,
    distanceMeters: 180,
    updatedAt: Date.now(),
    history24h: baseline(0.78),
  },
  {
    id: 'lot_south',
    name: 'South Lot',
    total: 280,
    open: 122,
    occupied: 152,
    reserved: 6,
    lat: 37.866,
    lng: -122.252,
    distanceMeters: 420,
    updatedAt: Date.now(),
    history24h: baseline(0.55),
  },
  {
    id: 'lot_stadium',
    name: 'Stadium Parking',
    total: 950,
    open: 610,
    occupied: 320,
    reserved: 20,
    lat: 37.871,
    lng: -122.251,
    distanceMeters: 780,
    updatedAt: Date.now(),
    history24h: baseline(0.33),
  },
  {
    id: 'lot_library',
    name: 'Library Garage',
    total: 180,
    open: 14,
    occupied: 164,
    reserved: 2,
    lat: 37.872,
    lng: -122.258,
    distanceMeters: 90,
    updatedAt: Date.now(),
    history24h: baseline(0.92),
  },
];

function baseline(target: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 24; i++) {
    const wave = 0.15 * Math.sin((i / 24) * Math.PI * 2);
    out.push(Math.min(1, Math.max(0, target + wave)));
  }
  return out;
}

export function getMockLots(): Lot[] {
  return state.map((l) => ({ ...l, history24h: [...l.history24h] }));
}

export function simulateUpdate(): LotUpdate | null {
  const lot = state[Math.floor(Math.random() * state.length)];
  const delta = Math.floor(Math.random() * 6) - 3;
  lot.occupied = Math.max(0, Math.min(lot.total - lot.reserved, lot.occupied + delta));
  lot.open = lot.total - lot.occupied - lot.reserved;
  lot.updatedAt = Date.now();
  return {
    lotId: lot.id,
    open: lot.open,
    occupied: lot.occupied,
    reserved: lot.reserved,
    ts: lot.updatedAt,
  };
}
