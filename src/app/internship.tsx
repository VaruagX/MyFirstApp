import { Download } from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, ChipGroup, FadeInView, InfoRow, PrimaryButton, SectionHeader, usePortfolioTextStyles } from '@/components/portfolio/ui';
import { internship } from '@/constants/portfolio';
import { Spacing } from '@/constants/theme';
import { showUnavailable } from '@/utils/actions';

export default function InternshipScreen() {
  const textStyles = usePortfolioTextStyles();

  return (
    <ScreenShell>
      <FadeInView>
        <SectionHeader eyebrow="Professional Training" title="Internship" subtitle="Hands-on mobile development experience with production workflows." />
      </FadeInView>
      <Card style={styles.card}>
        <InfoRow label="Company" value={internship.company} />
        <InfoRow label="Role" value={internship.role} />
        <InfoRow label="Duration" value={internship.duration} />
        <InfoRow label="Certificate" value={internship.certificate} />
        <Text style={textStyles.body}>{internship.description}</Text>
        <ChipGroup items={internship.skillsLearned} />
        <PrimaryButton label="Download Certificate" icon={Download} onPress={() => showUnavailable('Certificate')} />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.four,
  },
});
