import { View, Text, StyleSheet } from 'react-native';
import { statusFor, statusBadge } from '@/theme';

export function StatusPill({ open, total }: { open: number; total: number }) {
  const { key, label } = statusFor(open, total);
  const c = statusBadge[key];

  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.value, { color: c.num }]}>{open}</Text>
      <Text style={[styles.label, { color: c.label }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
  },
  value: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  label: { fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 1.5 },
});
