import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useMemo } from 'react';
import { useParkingStore } from '@/store/parkingStore';
import { StatusPill } from '@/components/StatusPill';

export default function DashboardScreen() {
  const lots = useParkingStore((s) => s.lots);
  const connection = useParkingStore((s) => s.connection);
  const updatedAt = useParkingStore((s) => s.updatedAt);

  const sorted = useMemo(
    () => [...lots].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)),
    [lots],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.connRow}>
        <View
          style={[
            styles.connDot,
            { backgroundColor: connection === 'live' ? '#4CD080' : connection === 'polling' ? '#F5C242' : '#F26565' },
          ]}
        />
        <Text style={styles.connText}>
          {connection === 'live' ? 'Live feed' : connection === 'polling' ? 'Polling fallback' : 'Offline'}
          {updatedAt ? ` · updated ${timeAgo(updatedAt)}` : ''}
        </Text>
      </View>

      <Text style={styles.title}>Nearest parking</Text>

      <FlatList
        scrollEnabled={false}
        data={sorted}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/lot/[id]', params: { id: item.id } }} asChild>
            <Pressable style={styles.lot}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lotName}>{item.name}</Text>
                <Text style={styles.lotMeta}>
                  {(item.distanceMeters ?? 0).toFixed(0)} m · {item.total} spaces
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
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  content: { padding: 20 },
  connRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  connDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  connText: { color: '#8C93A6', fontSize: 12 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 14 },
  lot: {
    backgroundColor: '#131B2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lotName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  lotMeta: { color: '#8C93A6', fontSize: 12, marginTop: 2 },
  analytics: {
    backgroundColor: '#131B2E',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  analyticsText: { color: '#5A9EFF', fontWeight: '700' },
});
