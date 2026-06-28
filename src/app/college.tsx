import { StyleSheet, Text } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, ChipGroup, FadeInView, GradientCard, InfoRow, SectionHeader, TimelineCard, usePortfolioTextStyles } from '@/components/portfolio/ui';
import { academicTimeline, college } from '@/constants/portfolio';
import { Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

export default function CollegeScreen() {
  const { theme } = useAppTheme();
  const textStyles = usePortfolioTextStyles();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <FadeInView>
        <GradientCard style={styles.hero}>
          <Text style={styles.collegeName}>{college.name}</Text>
          <Text style={styles.degree}>{college.degree} • {college.branch}</Text>
        </GradientCard>
      </FadeInView>

      <Card>
        <InfoRow label="Degree" value={college.degree} />
        <InfoRow label="Branch" value={college.branch} />
        <InfoRow label="Semester" value={college.semester} />
        <InfoRow label="CGPA" value={college.cgpa} />
        <InfoRow label="Passing Year" value={college.passingYear} />
      </Card>

      <SectionHeader eyebrow="Academics" title="Timeline" />
      {academicTimeline.map((item) => (
        <TimelineCard key={item.title} {...item} />
      ))}

      <Card style={styles.cardGap}>
        <Text style={textStyles.cardTitle}>Achievements</Text>
        <ChipGroup items={college.achievements} />
      </Card>

      <Card style={styles.cardGap}>
        <Text style={textStyles.cardTitle}>Activities</Text>
        <ChipGroup items={college.activities} />
      </Card>
    </ScreenShell>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  hero: {
    gap: Spacing.two,
  },
  collegeName: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  degree: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  cardGap: {
    gap: Spacing.three,
  },
  });
}
