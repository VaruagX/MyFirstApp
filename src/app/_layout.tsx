import { ThemeProvider } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CustomDrawerContent } from '@/components/portfolio/custom-drawer';
import { AppThemeProvider, useAppTheme } from '@/context/theme-context';

const screenTitles: Record<string, string> = {
  index: 'Home',
  about: 'About Me',
  education: 'Education',
  college: 'College',
  skills: 'Skills',
  projects: 'Projects',
  internship: 'Internship',
  resume: 'Resume',
  certificates: 'Certificates',
  experience: 'Experience',
  gallery: 'Gallery',
  contact: 'Contact',
  settings: 'Settings',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <ThemedDrawer />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedDrawer() {
  const { theme } = useAppTheme();

  const navigationTheme = {
    dark: theme.dark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '800' as const },
    },
  };

  return (
      <ThemeProvider value={navigationTheme}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: true,
            headerShadowColor: theme.colors.divider,
            drawerStyle: { width: 312, backgroundColor: theme.colors.backgroundSecondary },
            sceneStyle: { backgroundColor: theme.colors.background },
            title: screenTitles[route.name] ?? 'Portfolio',
            drawerItemStyle: route.name === 'explore' ? { display: 'none' } : undefined,
          })}>
          {Object.entries(screenTitles).map(([name, title]) => (
            <Drawer.Screen key={name} name={name} options={{ title }} />
          ))}
          <Drawer.Screen name="explore" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </ThemeProvider>
  );
}
