import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useParkingStore } from '@/store/parkingStore';
import { startLiveFeed, stopLiveFeed } from '@/services/liveFeed';

export default function RootLayout() {
  const bootstrap = useParkingStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
    startLiveFeed();
    return () => stopLiveFeed();
  }, [bootstrap]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0B1220' },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: '#0B1220' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Campus Parking' }} />
        <Stack.Screen name="lot/[id]" options={{ title: 'Lot detail' }} />
        <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
      </Stack>
    </>
  );
}
