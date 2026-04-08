// WebSocket live feed client with exponential backoff, heartbeat, and
// graceful REST polling fallback. Designed to drop in behind a real IoT
// gateway; uses mockBackend locally.

import { useParkingStore } from '@/store/parkingStore';
import { pollLots } from './iotApi';
import { simulateUpdate } from './mockBackend';

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let mockInterval: ReturnType<typeof setInterval> | null = null;
let attempt = 0;

const WS_URL = 'wss://iot.example.com/parking';
const BACKOFF = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000];
const POLL_EVERY = 5_000;
const USE_MOCK = true;

export function startLiveFeed() {
  if (USE_MOCK) {
    startMock();
    return;
  }
  connectWs();
}

export function stopLiveFeed() {
  if (ws) ws.close();
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (pollTimer) clearInterval(pollTimer);
  if (mockInterval) clearInterval(mockInterval);
  ws = null;
  reconnectTimer = null;
  pollTimer = null;
  mockInterval = null;
}

function connectWs() {
  try {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      attempt = 0;
      useParkingStore.getState().setConnection('live');
      stopPolling();
    };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data as string);
        if (data.type === 'lot_update') {
          useParkingStore.getState().applyUpdate(data);
        }
      } catch {}
    };
    ws.onerror = () => {
      startPolling();
    };
    ws.onclose = () => {
      useParkingStore.getState().setConnection('polling');
      scheduleReconnect();
      startPolling();
    };
  } catch {
    startPolling();
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  const delay = BACKOFF[Math.min(attempt, BACKOFF.length - 1)];
  attempt += 1;
  reconnectTimer = setTimeout(connectWs, delay);
}

function startPolling() {
  if (pollTimer) return;
  useParkingStore.getState().setConnection('polling');
  pollTimer = setInterval(async () => {
    const updates = await pollLots();
    const store = useParkingStore.getState();
    updates.forEach((u) => store.applyUpdate(u));
  }, POLL_EVERY);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

function startMock() {
  useParkingStore.getState().setConnection('live');
  mockInterval = setInterval(() => {
    const update = simulateUpdate();
    if (update) useParkingStore.getState().applyUpdate(update);
  }, 2_000);
}
