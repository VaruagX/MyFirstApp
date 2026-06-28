import { Image } from 'expo-image';
import { DrawerContentScrollView, type DrawerContentComponentProps } from 'expo-router/drawer';
import {
  Award,
  BriefcaseBusiness,
  Code2,
  FileText,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LogOut,
  Moon,
  Phone,
  Rocket,
  School,
  ScrollText,
  Settings,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { drawerItems, profile } from '@/constants/portfolio';
import { Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  user: User,
  'graduation-cap': GraduationCap,
  school: School,
  'code-2': Code2,
  rocket: Rocket,
  'scroll-text': ScrollText,
  'file-text': FileText,
  award: Award,
  'briefcase-business': BriefcaseBusiness,
  image: ImageIcon,
  phone: Phone,
  settings: Settings,
};

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme, isDark } = useAppTheme();
  const styles = createStyles(theme);
  const activeRoute = props.state.routeNames[props.state.index];
  const mainItems = drawerItems.filter((item) => item.route !== 'settings');
  const settingsItem = drawerItems.find((item) => item.route === 'settings');

  return (
    <View style={styles.root}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={profile.image} style={styles.avatar} contentFit="cover" />
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.items}>
          {mainItems.map((item) => (
            <DrawerRow
              key={item.route}
              label={item.label}
              icon={iconMap[item.icon] ?? Home}
              focused={activeRoute === item.route}
              onPress={() => props.navigation.navigate(item.route)}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.bottomSection}>
        {settingsItem ? (
          <DrawerRow
            label={settingsItem.label}
            icon={Settings}
            focused={activeRoute === 'settings'}
            onPress={() => props.navigation.navigate(settingsItem.route)}
          />
        ) : null}
        <View style={styles.themeRow}>
          <View style={styles.themeIcon}>
            <Moon size={16} color={theme.colors.textMuted} strokeWidth={2.2} />
          </View>
          <View style={styles.themeCopy}>
            <Text style={styles.themeTitle}>Theme</Text>
            <Text style={styles.themeValue}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
          </View>
        </View>
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Pressable style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
            <LogOut size={17} color={theme.colors.textMuted} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DrawerRow({ label, icon: Icon, focused, onPress }: { label: string; icon: LucideIcon; focused: boolean; onPress: () => void }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, focused && styles.itemActive, pressed && styles.pressed]}>
      <View style={[styles.activeBar, focused && styles.activeBarVisible]} />
      <View style={[styles.itemIcon, focused && styles.itemIconActive]}>
        <Icon size={19} color={focused ? theme.colors.primary : theme.colors.textMuted} strokeWidth={2.2} />
      </View>
      <Text style={[styles.itemLabel, focused && styles.itemLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  profileCard: {
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileCopy: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  name: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
  },
  title: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  email: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginBottom: Spacing.four,
  },
  items: {
    gap: Spacing.one,
  },
  item: {
    minHeight: 48,
    borderRadius: Radii.medium,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    position: 'relative',
  },
  itemActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.72,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  activeBarVisible: {
    backgroundColor: theme.colors.primary,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconActive: {
    backgroundColor: theme.colors.primarySoft,
  },
  itemLabel: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  itemLabelActive: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    gap: Spacing.two,
  },
  themeRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  themeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.section,
  },
  themeCopy: {
    gap: Spacing.half,
  },
  themeTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  themeValue: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  versionText: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: '600',
  },
  logout: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  });
}
