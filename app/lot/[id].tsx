import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useParkingStore } from '@/store/parkingStore';
import { StatusPill } from '@/components/StatusPill';
import { TrendChart } from '@/components/TrendChart';

export default function LotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lot = useParkingStore((s) => s.lots.find((l) => l.id === id));

  if (!lot) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lot not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lot.name}</Text>
      <Text style={styles.sub}>
        {lot.total} spaces · updated {Math.round((Date.now() - lot.updatedAt) / 1000)}s ago
      </Text>

      <View style={styles.statusCard}>
        <StatusPill open={lot.open} total={lot.total} large />
        <View style={styles.stats}>
          <Stat label="Open" value={lot.open} color="#4CD080" />
          <Stat label="Occupied" value={lot.occupied} color="#F26565" />
          <Stat label="Reserved" value={lot.reserved} color="#F5C242" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Last 24 hours</Text>
      <TrendChart values={lot.history24h} />

      <Pressable style={styles.cta} onPress={() => Alert.alert('Open in Maps', 'Launching directions...')}>
        <Text style={styles.ctaText}>Navigate to lot</Text>
      </Pressable>
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  sub: { color: '#8C93A6', fontSize: 13, marginTop: 4 },
  statusCard: { backgroundColor: '#131B2E', padding: 20, borderRadius: 16, marginTop: 20 },
  stats: { flexDirection: 'row', marginTop: 16, gap: 10 },
  stat: { flex: 1, backgroundColor: '#0B1220', padding: 14, borderRadius: 10, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#8C93A6', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  cta: {
    backgroundColor: '#5A9EFF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
