import { View, Text, StyleSheet } from 'react-native';

export function StatusPill({ open, total, large }: { open: number; total: number; large?: boolean }) {
  const ratio = open / total;
  const color = ratio > 0.25 ? '#4CD080' : ratio > 0.08 ? '#F5C242' : '#F26565';
  const label = ratio > 0.25 ? 'Plenty' : ratio > 0.08 ? 'Limited' : 'Full';

  return (
    <View style={[styles.pill, large && styles.large, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.value, large && styles.valueLarge, { color }]}>{open}</Text>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  large: { paddingVertical: 14, paddingHorizontal: 24 },
  value: { fontSize: 18, fontWeight: '800' },
  valueLarge: { fontSize: 32 },
  label: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
});
