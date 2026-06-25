import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { C } from '@/theme';

type Tab = 'live' | 'analytics' | 'history';

const ITEMS: { key: Tab; label: string; glyph: string; href?: string }[] = [
  { key: 'live', label: 'Live', glyph: '▦', href: '/' },
  { key: 'analytics', label: 'Analytics', glyph: '◔', href: '/analytics' },
  { key: 'history', label: 'History', glyph: '↺' },
];

export function BottomNav({ active }: { active: Tab }) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      {ITEMS.map((it) => {
        const on = it.key === active;
        return (
          <Pressable
            key={it.key}
            style={[styles.item, on && styles.itemActive]}
            onPress={() => it.href && router.replace(it.href as never)}
          >
            <Text style={[styles.glyph, { color: on ? C.onSecondaryContainer : C.onSurfaceVar }]}>{it.glyph}</Text>
            <Text style={[styles.label, { color: on ? C.onSecondaryContainer : C.onSurfaceVar }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(248,249,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + '4d',
    paddingTop: 8,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  item: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 4, borderRadius: 9999 },
  itemActive: { backgroundColor: C.secondaryContainer },
  glyph: { fontSize: 18, lineHeight: 22 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },
});
