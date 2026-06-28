import { Image } from 'expo-image';
import { Code2, ExternalLink, Heart, Share2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { AnimatedButton, Card, ChipGroup, FadeInView, PrimaryButton, SecondaryButton, SectionHeader, usePortfolioTextStyles } from '@/components/portfolio/ui';
import { projects } from '@/constants/portfolio';
import { Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { shareText, showUnavailable } from '@/utils/actions';

export default function ProjectsScreen() {
  const { theme } = useAppTheme();
  const textStyles = usePortfolioTextStyles();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Work" title="Projects" subtitle="Premium project cards with stack, features, and useful actions." />
      {projects.map((project, index) => (
        <FadeInView key={project.title} delay={index * 70}>
          <Card style={styles.projectCard}>
            <Image source={project.image} style={styles.projectImage} contentFit="cover" transition={250} />
            <View style={styles.headerRow}>
              <Text style={textStyles.cardTitle}>{project.title}</Text>
              <AnimatedButton style={styles.favoriteButton} onPress={() => showUnavailable('Favorite')}>
                <Heart size={19} color={theme.colors.primary} strokeWidth={2.2} />
              </AnimatedButton>
            </View>
            <Text style={textStyles.body}>{project.description}</Text>
            <ChipGroup items={project.stack} />
            <ChipGroup items={project.features} />
            <View style={styles.actions}>
              <PrimaryButton label="GitHub" icon={Code2} onPress={() => showUnavailable('GitHub')} />
              <SecondaryButton label="Live Demo" icon={ExternalLink} onPress={() => showUnavailable('Live Demo')} />
            </View>
            <SecondaryButton label="Share Project" icon={Share2} onPress={() => shareText(project.title, `${project.title}: ${project.description}`)} />
          </Card>
        </FadeInView>
      ))}
    </ScreenShell>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  projectCard: {
    gap: Spacing.four,
  },
  projectImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Radii.medium,
    backgroundColor: theme.colors.surfaceSoft,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  favoriteButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: theme.colors.primarySoft,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  });
}
