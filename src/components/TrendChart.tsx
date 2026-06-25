import { View, Text, StyleSheet } from 'react-native';
import { C } from '@/theme';

export function TrendChart({ values }: { values: number[] }) {
  const max = Math.max(0.01, ...values);
  return (
    <View>
      <View style={styles.chart}>
        {values.map((v, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: Math.max(6, (v / max) * 130),
                backgroundColor: v / max > 0.6 ? C.primaryContainer : C.primaryFixedDim,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.axis}>
        {['00:00', '06:00', '12:00', '18:00', '23:59'].map((t) => (
          <Text key={t} style={styles.axisLabel}>
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    gap: 3,
    paddingTop: 8,
  },
  bar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  axisLabel: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
});
