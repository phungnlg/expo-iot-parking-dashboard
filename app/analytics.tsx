import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useParkingStore } from '@/store/parkingStore';

export default function AnalyticsScreen() {
  const lots = useParkingStore((s) => s.lots);
  const totalSpaces = lots.reduce((a, l) => a + l.total, 0);
  const totalOccupied = lots.reduce((a, l) => a + l.occupied, 0);
  const utilization = totalSpaces ? (totalOccupied / totalSpaces) * 100 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Admin analytics</Text>
      <Text style={styles.subtitle}>Campus-wide utilization dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current utilization</Text>
        <Text style={styles.cardValue}>{utilization.toFixed(1)}%</Text>
        <Text style={styles.cardSub}>
          {totalOccupied} of {totalSpaces} spaces occupied
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Lot level</Text>
      {lots.map((l) => {
        const pct = (l.occupied / l.total) * 100;
        return (
          <View key={l.id} style={styles.lotRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lotName}>{l.name}</Text>
              <Text style={styles.lotMeta}>
                {l.occupied}/{l.total} occupied
              </Text>
            </View>
            <Text style={styles.lotPct}>{pct.toFixed(0)}%</Text>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Peak hours (last 7 days)</Text>
      <View style={styles.card}>
        <Text style={styles.cardSub}>Mon 08:00, 17:00</Text>
        <Text style={styles.cardSub}>Tue 09:00, 17:00</Text>
        <Text style={styles.cardSub}>Wed 08:00, 16:00</Text>
        <Text style={styles.cardSub}>Thu 09:00, 17:00</Text>
        <Text style={styles.cardSub}>Fri 10:00, 15:00</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#8C93A6', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#131B2E', padding: 20, borderRadius: 14, marginTop: 14 },
  cardLabel: { color: '#8C93A6', fontSize: 13 },
  cardValue: { color: '#FFFFFF', fontSize: 42, fontWeight: '800', marginTop: 4 },
  cardSub: { color: '#CFD6E5', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  lotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  lotName: { color: '#FFFFFF', fontWeight: '700' },
  lotMeta: { color: '#8C93A6', fontSize: 12, marginTop: 2 },
  lotPct: { color: '#5A9EFF', fontWeight: '800', fontSize: 16 },
});
