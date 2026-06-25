import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useParkingStore } from '@/store/parkingStore';
import { startLiveFeed, stopLiveFeed } from '@/services/liveFeed';
import { C } from '@/theme';

export default function RootLayout() {
  const bootstrap = useParkingStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
    startLiveFeed();
    return () => stopLiveFeed();
  }, [bootstrap]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerTintColor: C.primary,
          headerTitleStyle: { fontWeight: '700', color: C.primary },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Campus Parking' }} />
        <Stack.Screen name="lot/[id]" options={{ title: 'Lot detail' }} />
        <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
      </Stack>
    </>
  );
}
