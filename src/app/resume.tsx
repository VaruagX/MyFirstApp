import { Download, Eye, FileText, Share2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { Card, ChipGroup, FadeInView, GradientCard, PrimaryButton, SecondaryButton, SectionHeader } from '@/components/portfolio/ui';
import { RESUME_FILE_NAME } from '@/constants/files';
import { profile, resumeHighlights } from '@/constants/portfolio';
import { Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { downloadResumePdf, shareResumePdf, viewResumePdf } from '@/services/resume-file';

export default function ResumeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <FadeInView>
        <SectionHeader eyebrow="Resume" title="Developer Resume" subtitle="View, download, or share the latest resume PDF." />
      </FadeInView>
      <GradientCard style={styles.resumePreview}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.title}</Text>
        <Text style={styles.contact}>{profile.email} • {profile.phone}</Text>
      </GradientCard>
      <Card style={styles.card}>
        <View style={styles.fileHeader}>
          <View style={styles.pdfIcon}>
            <FileText size={22} color={theme.colors.primary} strokeWidth={2.2} />
            <Text style={styles.pdfIconText}>PDF</Text>
          </View>
          <View style={styles.fileCopy}>
            <Text style={styles.heading}>{RESUME_FILE_NAME}</Text>
            <Text style={styles.description}>
              A polished, recruiter-ready resume covering projects, skills, education, internships, and development experience.
            </Text>
          </View>
        </View>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.heading}>Resume Highlights</Text>
        <ChipGroup items={resumeHighlights} />
      </Card>
      <View style={styles.actions}>
        <PrimaryButton label="View Resume" icon={Eye} onPress={viewResumePdf} />
        <SecondaryButton label="Download Resume" icon={Download} onPress={downloadResumePdf} />
        <SecondaryButton label="Share Resume" icon={Share2} onPress={shareResumePdf} />
      </View>
    </ScreenShell>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  resumePreview: {
    minHeight: 180,
    justifyContent: 'center',
    gap: Spacing.two,
  },
  name: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  role: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  contact: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  card: {
    gap: Spacing.three,
  },
  fileHeader: {
    flexDirection: 'row',
    gap: Spacing.four,
    alignItems: 'center',
  },
  pdfIcon: {
    width: 54,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primarySoftBorder,
  },
  pdfIconText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  fileCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  actions: {
    gap: Spacing.three,
  },
  });
}
