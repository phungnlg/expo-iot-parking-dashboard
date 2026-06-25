import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useParkingStore } from '@/store/parkingStore';
import { TrendChart } from '@/components/TrendChart';
import { BottomNav } from '@/components/BottomNav';
import { C, cardShadow, statusFor } from '@/theme';

export default function LotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lot = useParkingStore((s) => s.lots.find((l) => l.id === id));

  if (!lot) {
    return (
      <View style={styles.screen}>
        <Text style={styles.heroStatus}>Lot not found</Text>
      </View>
    );
  }

  const { label } = statusFor(lot.open, lot.total);
  const filledPct = Math.round((lot.occupied / lot.total) * 100);
  const updatedSec = Math.max(0, Math.round((Date.now() - lot.updatedAt) / 1000));

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.lotName}>{lot.name}</Text>

        {/* Hero capacity */}
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.caps}>CURRENT CAPACITY</Text>
            <Text style={styles.heroStatus}>{label}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.heroNumber}>{lot.open}</Text>
            <Text style={styles.muted}>Spaces left</Text>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${filledPct}%` }]} />
        </View>
        <Text style={[styles.muted, { textAlign: 'right', marginTop: 6 }]}>
          {lot.occupied} / {lot.total} spots filled
        </Text>

        {/* Bento stats */}
        <View style={styles.bento}>
          <Stat label="OPEN" value={lot.open} color={C.secondary} />
          <Stat label="OCCUPIED" value={lot.occupied} color={C.onSurface} />
          <Stat label="RESERVED" value={lot.reserved} color={C.tertiary} />
        </View>

        {/* Trend */}
        <View style={styles.chartCard}>
          <View style={styles.chartHead}>
            <Text style={styles.sectionTitle}>Last 24 Hours</Text>
            <View style={styles.legend}>
              <View style={styles.legendDot} />
              <Text style={styles.caps}>UTILIZATION</Text>
            </View>
          </View>
          <TrendChart values={lot.history24h} />
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => Alert.alert('Open in Maps', 'Launching directions...')}
        >
          <Text style={styles.ctaText}>Navigate to lot</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Updated {updatedSec} seconds ago</Text>
            <Text style={styles.muted}>
              Occupancy data refreshes in real-time. Reserved spots are held for pre-booked permits
              and guest passes.
            </Text>
          </View>
        </View>
      </ScrollView>
      <BottomNav active="live" />
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 110 },
  lotName: { color: C.onSurface, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16 },
  caps: { color: C.onSurfaceVar, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroStatus: { color: C.primary, fontSize: 34, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
  heroNumber: { color: C.onSurface, fontSize: 28, fontWeight: '800' },
  muted: { color: C.onSurfaceVar, fontSize: 14, lineHeight: 20 },
  track: { height: 12, backgroundColor: C.container, borderRadius: 9999, overflow: 'hidden', marginTop: 12 },
  fill: { height: '100%', backgroundColor: C.primaryContainer, borderRadius: 9999 },
  bento: { flexDirection: 'row', gap: 12, marginTop: 24 },
  stat: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    ...cardShadow,
  },
  statLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '800' },
  chartCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    ...cardShadow,
  },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: C.onSurface, fontSize: 18, fontWeight: '700' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  cta: {
    backgroundColor: C.primaryContainer,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    ...cardShadow,
  },
  ctaText: { color: C.onPrimary, fontWeight: '700', fontSize: 17 },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: C.containerLow,
    borderRadius: 16,
    marginTop: 20,
  },
  infoIcon: { color: C.secondary, fontSize: 18, fontWeight: '700' },
  infoTitle: { color: C.onSurface, fontSize: 16, fontWeight: '700', marginBottom: 4 },
});
