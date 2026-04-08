import { create } from 'zustand';
import type { Lot, LotUpdate } from '@/services/iotApi';
import { fetchLots } from '@/services/iotApi';

type Connection = 'idle' | 'live' | 'polling' | 'offline';

type ParkingState = {
  lots: Lot[];
  updatedAt: number | null;
  connection: Connection;
  bootstrap: () => Promise<void>;
  applyUpdate: (u: LotUpdate) => void;
  setConnection: (c: Connection) => void;
};

export const useParkingStore = create<ParkingState>((set) => ({
  lots: [],
  updatedAt: null,
  connection: 'idle',
  bootstrap: async () => {
    const lots = await fetchLots();
    set({ lots, updatedAt: Date.now() });
  },
  applyUpdate: (u) =>
    set((s) => ({
      updatedAt: Date.now(),
      lots: s.lots.map((l) =>
        l.id === u.lotId
          ? {
              ...l,
              open: u.open,
              occupied: u.occupied,
              reserved: u.reserved,
              updatedAt: u.ts,
              history24h: [...l.history24h.slice(-23), u.occupied / l.total],
            }
          : l,
      ),
    })),
  setConnection: (connection) => set({ connection }),
}));
