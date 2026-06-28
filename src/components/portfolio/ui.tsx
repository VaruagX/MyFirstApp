import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { ReactNode, useEffect, useState } from 'react';
import {
  Animated,
  ColorValue,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';

import { lightTheme, Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

const supportsNativeDriver = Platform.OS !== 'web';

export function FadeInView({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(14));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, delay, useNativeDriver: supportsNativeDriver }),
      Animated.timing(translateY, { toValue: 0, duration: 360, delay, useNativeDriver: supportsNativeDriver }),
    ]).start();
  }, [delay, opacity, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

export function AnimatedButton({ children, style, ...props }: PressableProps & { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const [scale] = useState(() => new Animated.Value(1));

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        Animated.spring(scale, { toValue: 0.975, useNativeDriver: supportsNativeDriver }).start();
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: supportsNativeDriver }).start();
        props.onPressOut?.(event);
      }}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

export function GradientCard({
  children,
  colors,
  style,
}: {
  children: ReactNode;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const gradientColors = colors ?? [theme.colors.heroStart, theme.colors.heroEnd];

  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.gradientCard, style]}>
      {children}
    </LinearGradient>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.sectionHeader}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      <View style={styles.sectionDivider} />
    </View>
  );
}

export function ProfileImage({ size = 112, source }: { size?: number; source: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.profileRing, { width: size + 10, height: size + 10, borderRadius: size }]}>
      <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" transition={250} />
    </View>
  );
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.statCard}>
      <View style={styles.statIcon}>{Icon ? <Icon size={18} color={theme.colors.primary} strokeWidth={2.2} /> : null}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {description ? <Text style={styles.muted}>{description}</Text> : null}
    </Card>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function Chip({ label }: { label: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return <Text style={styles.chip}>{label}</Text>;
}

export function ChipGroup({ items = [] }: { items?: string[] }) {
  return (
    <View style={baseStyles.chipGroup}>
      {items.map((item) => (
        <Chip key={item} label={item} />
      ))}
    </View>
  );
}

export function TimelineCard({ year, title, subtitle, meta }: { year: string; title: string; subtitle: string; meta: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={baseStyles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={styles.timelineLine} />
        <View style={styles.timelineDot} />
      </View>
      <Card style={styles.timelineCard}>
        <Text style={styles.eyebrow}>{year}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{subtitle}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </Card>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [width] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(width, { toValue: value, duration: 700, useNativeDriver: false }).start();
  }, [value, width]);

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

function ButtonContent({ label, icon: Icon, color }: { label: string; icon?: LucideIcon; color: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.buttonContent}>
      {Icon ? <Icon size={18} color={color} strokeWidth={2.3} /> : null}
      <Text style={[styles.buttonTextBase, { color }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: LucideIcon }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AnimatedButton onPress={onPress} style={styles.primaryButton}>
      <ButtonContent label={label} icon={icon} color={theme.colors.buttonTextOnPrimary} />
    </AnimatedButton>
  );
}

export function SecondaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: LucideIcon }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AnimatedButton onPress={onPress} style={styles.secondaryButton}>
      <ButtonContent label={label} icon={icon} color={theme.colors.text} />
    </AnimatedButton>
  );
}

export function GhostButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: LucideIcon }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AnimatedButton onPress={onPress} style={styles.ghostButton}>
      <ButtonContent label={label} icon={icon} color={theme.colors.primary} />
    </AnimatedButton>
  );
}

export function IconButton({ icon: Icon, onPress, label }: { icon: LucideIcon; onPress: () => void; label: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AnimatedButton accessibilityLabel={label} onPress={onPress} style={styles.iconButton}>
      <Icon size={19} color={theme.colors.text} strokeWidth={2.2} />
    </AnimatedButton>
  );
}

export function FormInput({ placeholder, multiline, style, ...props }: TextInputProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSubtle}
      multiline={multiline}
      style={[styles.input, multiline && styles.textArea, style]}
      {...props}
    />
  );
}

export const portfolioText = StyleSheet.create({
  title: {
    color: lightTheme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: lightTheme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  cardTitle: {
    color: lightTheme.colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    color: lightTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
  },
});

export function usePortfolioTextStyles() {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    title: {
      ...portfolioText.title,
      color: theme.colors.text,
    },
    subtitle: {
      ...portfolioText.subtitle,
      color: theme.colors.textMuted,
    },
    cardTitle: {
      ...portfolioText.cardTitle,
      color: theme.colors.text,
    },
    body: {
      ...portfolioText.body,
      color: theme.colors.textMuted,
    },
  });
}

const baseStyles = StyleSheet.create({
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    gradientCard: {
      borderRadius: Radii.xlarge,
      padding: Spacing.seven,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.soft,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: Radii.large,
      padding: Spacing.six,
      ...theme.shadows.card,
    },
    sectionHeader: {
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 26,
      lineHeight: 32,
      fontWeight: '800',
    },
    sectionSubtitle: {
      color: theme.colors.textMuted,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: '500',
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginTop: Spacing.two,
    },
    profileRing: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.soft,
    },
    statCard: {
      flexBasis: '46%',
      flexGrow: 1,
      minWidth: 150,
      gap: Spacing.two,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primarySoft,
    },
    statValue: {
      color: theme.colors.text,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '800',
    },
    statLabel: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: '700',
    },
    muted: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '500',
    },
    infoRow: {
      gap: Spacing.one,
      paddingVertical: Spacing.four,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    infoLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    infoValue: {
      color: theme.colors.text,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '600',
    },
    chip: {
      overflow: 'hidden',
      color: theme.colors.text,
      backgroundColor: theme.colors.surfaceSoft,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: Radii.round,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      fontSize: 13,
      fontWeight: '600',
    },
    timelineRail: {
      width: 22,
      alignItems: 'center',
    },
    timelineLine: {
      position: 'absolute',
      top: Spacing.five,
      bottom: -Spacing.six,
      width: 1,
      backgroundColor: theme.colors.divider,
    },
    timelineDot: {
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor: theme.colors.primary,
      marginTop: Spacing.five,
      borderWidth: 3,
      borderColor: theme.colors.timelineDotBorder,
    },
    timelineCard: {
      flex: 1,
      gap: Spacing.one,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
    },
    cardBody: {
      color: theme.colors.textMuted,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: '500',
    },
    meta: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    progressTrack: {
      height: 8,
      backgroundColor: theme.colors.section,
      borderRadius: Radii.round,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: Radii.round,
    },
    primaryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderRadius: Radii.round,
      paddingHorizontal: Spacing.five,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.soft,
    },
    secondaryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderRadius: Radii.round,
      paddingHorizontal: Spacing.five,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    ghostButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      borderRadius: Radii.round,
      paddingHorizontal: Spacing.four,
      backgroundColor: 'transparent',
    },
    iconButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
    },
    buttonTextBase: {
      fontSize: 15,
      fontWeight: '700',
    },
    input: {
      minHeight: 52,
      borderRadius: Radii.medium,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      paddingHorizontal: Spacing.four,
      fontSize: 15,
      fontWeight: '500',
    },
    textArea: {
      minHeight: 120,
      paddingTop: Spacing.four,
      textAlignVertical: 'top',
    },
  });
}
