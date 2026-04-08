import { View, StyleSheet } from 'react-native';

export function TrendChart({ values }: { values: number[] }) {
  const max = Math.max(0.01, ...values);
  return (
    <View style={styles.container}>
      {values.map((v, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: Math.max(4, (v / max) * 60),
              backgroundColor: v > 0.8 ? '#F26565' : v > 0.5 ? '#F5C242' : '#4CD080',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 64,
    backgroundColor: '#131B2E',
    padding: 8,
    borderRadius: 10,
    gap: 3,
  },
  bar: { flex: 1, borderRadius: 2 },
});
