import { StyleSheet, Switch, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, InfoRow, SectionHeader } from '@/components/portfolio/ui';
import { Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

export default function SettingsScreen() {
  const { theme, isDark, setThemeMode } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Preferences" title="Settings" subtitle="Theme controls and app information for a polished settings surface." />
      <Card style={styles.card}>
        <SettingToggle label="Dark Mode" value={isDark} onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')} />
        <SettingToggle label="Light Mode" value={!isDark} onValueChange={(value) => setThemeMode(value ? 'light' : 'dark')} />
        <InfoRow label="Accent Color" value={theme.colors.accent} />
        <InfoRow label="Font Size" value="Default" />
      </Card>
      <Card>
        <InfoRow label="About App" value="Premium personal portfolio built with Expo Router." />
        <InfoRow label="Privacy Policy" value="No personal data is stored by this demo app." />
        <InfoRow label="Version" value="1.0.0" />
      </Card>
    </ScreenShell>
  );
}

function SettingToggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.toggleRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.surfaceSoft, true: theme.colors.primary }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  card: {
    gap: Spacing.one,
  },
  toggleRow: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  label: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  });
}
