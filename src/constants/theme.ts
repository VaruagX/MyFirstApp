import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export type AppThemeMode = 'light' | 'dark';

export type AppThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  section: string;
  surface: string;
  surfaceSoft: string;
  surfacePressed: string;
  accent: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  danger: string;
  heroStart: string;
  heroEnd: string;
  primarySoft: string;
  primarySoftBorder: string;
  overlay: string;
  modalOverlay: string;
  timelineDotBorder: string;
  buttonTextOnPrimary: string;
};

export type AppTheme = {
  mode: AppThemeMode;
  dark: boolean;
  colors: AppThemeColors;
  shadows: {
    card: ViewStyle;
    soft: ViewStyle;
  };
};

const lightCardShadow: ViewStyle = {
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 24,
  elevation: 3,
};

const lightSoftShadow: ViewStyle = {
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 18,
  elevation: 2,
};

const darkCardShadow: ViewStyle = {
  shadowColor: '#020617',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.18,
  shadowRadius: 24,
  elevation: 3,
};

const darkSoftShadow: ViewStyle = {
  shadowColor: '#020617',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.14,
  shadowRadius: 18,
  elevation: 2,
};

export const lightTheme: AppTheme = {
  mode: 'light',
  dark: false,
  colors: {
    primary: '#2563EB',
    secondary: '#1D4ED8',
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    section: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceSoft: '#F8FAFC',
    surfacePressed: '#F3F4F6',
    accent: '#2563EB',
    text: '#111827',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    border: '#E5E7EB',
    divider: '#E5E7EB',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    heroStart: '#FFFFFF',
    heroEnd: '#EEF2F7',
    primarySoft: '#EFF6FF',
    primarySoftBorder: '#DBEAFE',
    overlay: 'rgba(2, 6, 23, 0.82)',
    modalOverlay: 'rgba(2, 6, 23, 0.92)',
    timelineDotBorder: '#FFFFFF',
    buttonTextOnPrimary: '#FFFFFF',
  },
  shadows: {
    card: Platform.select<ViewStyle>({
      web: { boxShadow: '0 10px 28px rgba(17, 24, 39, 0.08)' },
      default: lightCardShadow,
    }),
    soft: Platform.select<ViewStyle>({
      web: { boxShadow: '0 8px 20px rgba(17, 24, 39, 0.06)' },
      default: lightSoftShadow,
    }),
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  dark: true,
  colors: {
    primary: '#2563EB',
    secondary: '#2563EB',
    background: '#0F172A',
    backgroundSecondary: '#0F172A',
    section: '#1E293B',
    surface: '#1E293B',
    surfaceSoft: '#0F172A',
    surfacePressed: '#334155',
    accent: '#2563EB',
    text: '#F8FAFC',
    textMuted: '#CBD5E1',
    textSubtle: '#94A3B8',
    border: '#334155',
    divider: '#334155',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    heroStart: '#1E293B',
    heroEnd: '#0F172A',
    primarySoft: 'rgba(37, 99, 235, 0.18)',
    primarySoftBorder: 'rgba(37, 99, 235, 0.34)',
    overlay: 'rgba(2, 6, 23, 0.82)',
    modalOverlay: 'rgba(2, 6, 23, 0.94)',
    timelineDotBorder: '#0F172A',
    buttonTextOnPrimary: '#FFFFFF',
  },
  shadows: {
    card: Platform.select<ViewStyle>({
      web: { boxShadow: '0 10px 28px rgba(2, 6, 23, 0.28)' },
      default: darkCardShadow,
    }),
    soft: Platform.select<ViewStyle>({
      web: { boxShadow: '0 8px 20px rgba(2, 6, 23, 0.22)' },
      default: darkSoftShadow,
    }),
  },
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export const PortfolioColors = lightTheme.colors;

export const Colors = {
  light: {
    text: lightTheme.colors.text,
    background: lightTheme.colors.background,
    backgroundElement: lightTheme.colors.surface,
    backgroundSelected: lightTheme.colors.surfacePressed,
    textSecondary: lightTheme.colors.textMuted,
  },
  dark: {
    text: darkTheme.colors.text,
    background: darkTheme.colors.background,
    backgroundElement: darkTheme.colors.surface,
    backgroundSelected: darkTheme.colors.surfacePressed,
    textSecondary: darkTheme.colors.textMuted,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 56,
} as const;

export const Radii = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  round: 999,
} as const;

export const Shadows = lightTheme.shadows;

export const BottomTabInset = 0;
export const MaxContentWidth = 900;
