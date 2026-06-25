import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useParkingStore } from '@/store/parkingStore';
import { BottomNav } from '@/components/BottomNav';
import { C, cardShadow } from '@/theme';

const PEAK = [
  ['Mon', '08:00, 17:00'],
  ['Tue', '09:00, 17:00'],
  ['Wed', '08:00, 16:00'],
  ['Thu', '09:00, 17:00'],
  ['Fri', '10:00, 15:00'],
];

export default function AnalyticsScreen() {
  const lots = useParkingStore((s) => s.lots);
  const totalSpaces = lots.reduce((a, l) => a + l.total, 0);
  const totalOccupied = lots.reduce((a, l) => a + l.occupied, 0);
  const utilization = totalSpaces ? (totalOccupied / totalSpaces) * 100 : 0;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Admin analytics</Text>
        <Text style={styles.subtitle}>Campus-wide utilization dashboard</Text>

        {/* Utilization hero */}
        <View style={styles.heroCard}>
          <Text style={styles.caps}>CURRENT UTILIZATION</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroValue}>{utilization.toFixed(1)}%</Text>
            <Text style={styles.heroSub}>
              {totalOccupied} of {totalSpaces} spaces occupied
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${utilization}%` }]} />
          </View>
          <View style={styles.legendRow}>
            <Legend color={C.primaryContainer} label="Occupied" />
            <Legend color={C.containerHigh} label="Available" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lot level</Text>
        <View style={{ gap: 12 }}>
          {lots.map((l) => {
            const pct = Math.round((l.occupied / l.total) * 100);
            const near = pct >= 85;
            const accent = near ? C.tertiary : C.primaryContainer;
            return (
              <View key={l.id} style={[styles.lotCard, near && { borderColor: C.tertiaryFixed, borderWidth: 2 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lotName}>{l.name}</Text>
                  <Text style={[styles.lotMeta, near && { color: C.tertiary, fontWeight: '700' }]}>
                    {near ? 'Near capacity' : `${l.occupied}/${l.total} occupied`}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[styles.lotPct, { color: accent }]}>{pct}%</Text>
                  <View style={[styles.miniTrack, near && { backgroundColor: C.tertiaryFixed }]}>
                    <View style={[styles.miniFill, { width: `${pct}%`, backgroundColor: accent }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Peak hours (last 7 days)</Text>
        <View style={styles.peakCard}>
          {PEAK.map(([day, time], i) => (
            <View key={day} style={[styles.peakRow, i < PEAK.length - 1 && styles.peakDivider]}>
              <Text style={styles.peakDay}>{day}</Text>
              <Text style={styles.peakTime}>{time}</Text>
            </View>
          ))}
        </View>

        {/* Optimization hint */}
        <View style={styles.hintCard}>
          <Text style={styles.hintIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.hintTitle}>Optimization Hint</Text>
            <Text style={styles.hintBody}>
              Traffic patterns suggest dynamic pricing or temporary staff passes for Stadium Parking
              between 08:00-10:00 to balance load from Library Garage.
            </Text>
          </View>
        </View>
      </ScrollView>
      <BottomNav active="analytics" />
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legend}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 110 },
  title: { color: C.onSurface, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: C.onSurfaceVar, fontSize: 14, marginTop: 4 },
  caps: { color: C.onSurfaceVar, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },

  heroCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    ...cardShadow,
  },
  heroRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 },
  heroValue: { color: C.primaryContainer, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  heroSub: { color: C.onSurfaceVar, fontSize: 14, flex: 1 },
  track: { height: 12, backgroundColor: C.containerHigh, borderRadius: 9999, overflow: 'hidden', marginTop: 20 },
  fill: { height: '100%', backgroundColor: C.primaryContainer, borderRadius: 9999 },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 14 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { color: C.onSurfaceVar, fontSize: 14 },

  sectionTitle: { color: C.onSurface, fontSize: 18, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  lotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    padding: 16,
    borderRadius: 16,
  },
  lotName: { color: C.onSurface, fontSize: 18, fontWeight: '700' },
  lotMeta: { color: C.onSurfaceVar, fontSize: 14, marginTop: 2 },
  lotPct: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  miniTrack: { width: 96, height: 6, backgroundColor: C.containerHigh, borderRadius: 9999, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 9999 },

  peakCard: {
    backgroundColor: C.containerLow,
    borderWidth: 1,
    borderColor: C.outlineVariant + '4d',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  peakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  peakDivider: { borderBottomWidth: 1, borderBottomColor: C.outlineVariant + '33' },
  peakDay: { color: C.onSurfaceVar, fontSize: 16 },
  peakTime: {
    color: C.onPrimary,
    backgroundColor: C.primaryContainer,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  hintCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: C.secondaryContainer,
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
  },
  hintIcon: { fontSize: 20 },
  hintTitle: { color: C.onSecondaryContainer, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  hintBody: { color: C.onSecondaryContainer, fontSize: 14, lineHeight: 20 },
});
