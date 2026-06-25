import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useMemo } from 'react';
import { useParkingStore } from '@/store/parkingStore';
import { StatusPill } from '@/components/StatusPill';
import { BottomNav } from '@/components/BottomNav';
import { C, cardShadow } from '@/theme';

export default function DashboardScreen() {
  const lots = useParkingStore((s) => s.lots);
  const connection = useParkingStore((s) => s.connection);
  const updatedAt = useParkingStore((s) => s.updatedAt);

  const sorted = useMemo(
    () => [...lots].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)),
    [lots],
  );

  const dotColor = connection === 'live' ? C.success : connection === 'polling' ? '#f59e0b' : C.tertiary;
  const connLabel =
    connection === 'live' ? 'Live feed' : connection === 'polling' ? 'Polling fallback' : 'Offline';

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.connRow}>
          <View style={[styles.connDot, { backgroundColor: dotColor }]} />
          <Text style={styles.connText}>
            {connLabel}
            {updatedAt ? ` · updated ${timeAgo(updatedAt)}` : ''}
          </Text>
        </View>

        <Text style={styles.title}>Nearest parking</Text>
        <Text style={styles.subtitle}>Real-time availability for garages near your location.</Text>

        <FlatList
          scrollEnabled={false}
          data={sorted}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ gap: 12, marginTop: 20 }}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/lot/[id]', params: { id: item.id } }} asChild>
              <Pressable style={styles.lot}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lotName}>{item.name}</Text>
                  <Text style={styles.lotMeta}>
                    ◎ {(item.distanceMeters ?? 0).toFixed(0)} m · {item.total} spaces
                  </Text>
                </View>
                <StatusPill open={item.open} total={item.total} />
              </Pressable>
            </Link>
          )}
        />

        <Link href="/analytics" asChild>
          <Pressable style={styles.analytics}>
            <Text style={styles.analyticsText}>View analytics dashboard</Text>
            <Text style={styles.analyticsIcon}>↗</Text>
          </Pressable>
        </Link>
      </ScrollView>
      <BottomNav active="live" />
    </View>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 110 },
  connRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  connDot: { width: 9, height: 9, borderRadius: 5, marginRight: 8 },
  connText: { color: C.onSurfaceVar, fontSize: 14 },
  title: { color: C.onSurface, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: C.onSurfaceVar, fontSize: 16, marginTop: 6, lineHeight: 22 },
  lot: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  lotName: { color: C.onSurface, fontSize: 18, fontWeight: '700' },
  lotMeta: { color: C.onSurfaceVar, fontSize: 14, marginTop: 4 },
  analytics: {
    backgroundColor: C.primaryContainer,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    ...cardShadow,
  },
  analyticsText: { color: C.onPrimary, fontWeight: '700', fontSize: 17 },
  analyticsIcon: { color: C.onPrimary, fontWeight: '700', fontSize: 17 },
});
