import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, ChipGroup, FadeInView, ProgressBar, SectionHeader, usePortfolioTextStyles } from '@/components/portfolio/ui';
import { skills } from '@/constants/portfolio';
import { Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

export default function SkillsScreen() {
  const { theme } = useAppTheme();
  const textStyles = usePortfolioTextStyles();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Toolkit" title="Skills" subtitle="Categorized skills with animated proficiency indicators." />
      {skills.map((skill, index) => (
        <FadeInView key={skill.category} delay={index * 70}>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={textStyles.cardTitle}>{skill.category}</Text>
              <Text style={styles.percent}>{skill.progress}%</Text>
            </View>
            <ProgressBar value={skill.progress} />
            <ChipGroup items={skill.items} />
          </Card>
        </FadeInView>
      ))}
    </ScreenShell>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  card: {
    gap: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  percent: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },
  });
}
