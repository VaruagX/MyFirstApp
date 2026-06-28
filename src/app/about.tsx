import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, ChipGroup, FadeInView, InfoRow, SectionHeader, usePortfolioTextStyles } from '@/components/portfolio/ui';
import { aboutSections, hobbies, interests, languages, personalInfo } from '@/constants/portfolio';
import { Spacing } from '@/constants/theme';

export default function AboutScreen() {
  const textStyles = usePortfolioTextStyles();

  return (
    <ScreenShell>
      <FadeInView>
        <SectionHeader eyebrow="Profile" title="About Me" subtitle="A concise view of who I am, what I am building, and where I am headed." />
      </FadeInView>

      {aboutSections.map((section, index) => (
        <FadeInView key={section.title} delay={index * 80}>
          <Card style={styles.cardGap}>
            <Text style={textStyles.cardTitle}>{section.title}</Text>
            <Text style={textStyles.body}>{section.body}</Text>
          </Card>
        </FadeInView>
      ))}

      <Card>
        {personalInfo.map(([label, value]) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </Card>

      <View style={styles.grid}>
        <Card style={styles.cardGap}>
          <Text style={textStyles.cardTitle}>Interests</Text>
          <ChipGroup items={interests} />
        </Card>
        <Card style={styles.cardGap}>
          <Text style={textStyles.cardTitle}>Languages</Text>
          <ChipGroup items={languages} />
        </Card>
        <Card style={styles.cardGap}>
          <Text style={textStyles.cardTitle}>Hobbies</Text>
          <ChipGroup items={hobbies} />
        </Card>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cardGap: {
    gap: Spacing.three,
  },
  grid: {
    gap: Spacing.three,
  },
});
