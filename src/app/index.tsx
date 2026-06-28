import { router, type Href } from 'expo-router';
import { ArrowRight, Award, BriefcaseBusiness, Code2, FileText, GraduationCap, Mail, Rocket, UserRound, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import {
  AnimatedButton,
  FadeInView,
  GradientCard,
  IconButton,
  PrimaryButton,
  ProfileImage,
  SecondaryButton,
  SectionHeader,
  StatCard,
  usePortfolioTextStyles,
} from '@/components/portfolio/ui';
import { profile, quickActions, stats } from '@/constants/portfolio';
import { Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { openExternal } from '@/utils/actions';

const statIcons: Record<string, LucideIcon> = {
  rocket: Rocket,
  award: Award,
  'code-2': Code2,
  'briefcase-business': BriefcaseBusiness,
  'graduation-cap': GraduationCap,
  github: Code2,
};

export default function HomeScreen() {
  return (
    <ScreenShell>
      <ScreenContent />
    </ScreenShell>
  );
}

function ScreenContent() {
  const { theme } = useAppTheme();
  const textStyles = usePortfolioTextStyles();
  const styles = createStyles(theme);

  return (
    <View style={styles.page}>
      <FadeInView>
        <GradientCard style={styles.hero}>
          <ProfileImage source={profile.image} size={120} />
          <View style={styles.heroCopy}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{profile.title}</Text>
            <Text style={styles.tagline}>{profile.tagline}</Text>
          </View>

          <View style={styles.socialRow}>
            <IconButton label="GitHub" icon={Code2} onPress={() => openExternal(profile.github)} />
            <IconButton label="LinkedIn" icon={UserRound} onPress={() => openExternal(profile.linkedin)} />
            <IconButton label="Email" icon={Mail} onPress={() => openExternal(`mailto:${profile.email}`)} />
          </View>

          <View style={styles.actionRow}>
            <PrimaryButton label="Resume" icon={FileText} onPress={() => router.push('/resume' as Href)} />
            <SecondaryButton label="Contact" icon={Mail} onPress={() => router.push('/contact' as Href)} />
          </View>
        </GradientCard>
      </FadeInView>

      <FadeInView delay={120} style={styles.introCard}>
        <Text style={textStyles.cardTitle}>A refined snapshot of my work</Text>
        <Text style={textStyles.body}>
          Projects, education, skills, experience, certificates, and contact details presented with a calm, recruiter-friendly mobile experience.
        </Text>
      </FadeInView>

      <FadeInView delay={180}>
        <SectionHeader eyebrow="Overview" title="Dashboard" subtitle="A quick look at the portfolio areas that matter most." />
      </FadeInView>

      <View style={styles.statsGrid}>
        {stats.map((item, index) => (
          <FadeInView key={item.label} delay={index * 45} style={styles.statWrap}>
            <StatCard label={item.label} value={item.value} description={item.description} icon={statIcons[item.icon]} />
          </FadeInView>
        ))}
      </View>

      <View style={styles.quickGrid}>
        {quickActions.map((action, index) => (
          <FadeInView key={action.title} delay={index * 80}>
            <AnimatedButton
              style={styles.quickCard}
              onPress={() => router.push((action.route === 'index' ? '/' : `/${action.route}`) as Href)}>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickDescription}>{action.description}</Text>
              </View>
              <View style={styles.quickIcon}>
                <ArrowRight size={18} color={theme.colors.primary} strokeWidth={2.2} />
              </View>
            </AnimatedButton>
          </FadeInView>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  page: {
    gap: Spacing.seven,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.six,
    paddingVertical: Spacing.eight,
  },
  heroCopy: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  role: {
    color: theme.colors.primary,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 560,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  introCard: {
    gap: Spacing.two,
    backgroundColor: theme.colors.surface,
    borderRadius: Radii.large,
    padding: Spacing.six,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  statWrap: {
    flexBasis: '46%',
    flexGrow: 1,
  },
  quickGrid: {
    gap: Spacing.three,
  },
  quickCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: Radii.large,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.four,
    ...theme.shadows.card,
  },
  quickCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  quickTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  quickDescription: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primarySoft,
  },
  });
}
