import { Image } from 'expo-image';
import { Download, Share2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/portfolio/screen-shell';
import { AnimatedButton, Card, FormInput, PrimaryButton, SectionHeader } from '@/components/portfolio/ui';
import { certificates } from '@/constants/portfolio';
import { Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { shareText, showUnavailable } from '@/utils/actions';

export default function CertificatesScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<(typeof certificates)[number] | null>(null);
  const filtered = useMemo(
    () => certificates.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <ScreenShell>
      <SectionHeader eyebrow="Proof of Work" title="Certificates" subtitle="Searchable gallery with preview, download, and share actions." />
      <FormInput placeholder="Search certificates" value={query} onChangeText={setQuery} />
      <View style={styles.grid}>
        {filtered.map((certificate) => (
          <AnimatedButton key={certificate.title} style={styles.tile} onPress={() => setPreview(certificate)}>
            <Image source={certificate.image} style={styles.image} contentFit="cover" transition={250} />
            <Text style={styles.title}>{certificate.title}</Text>
            <Text style={styles.issuer}>{certificate.issuer}</Text>
          </AnimatedButton>
        ))}
      </View>

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPreview(null)}>
          {preview ? (
            <Card style={styles.modalCard}>
              <Image source={preview.image} style={styles.previewImage} contentFit="cover" />
              <Text style={styles.title}>{preview.title}</Text>
              <Text style={styles.issuer}>{preview.issuer}</Text>
              <PrimaryButton label="Download" icon={Download} onPress={() => showUnavailable('Certificate Download')} />
              <PrimaryButton label="Share" icon={Share2} onPress={() => shareText(preview.title, `${preview.title} by ${preview.issuer}`)} />
            </Card>
          ) : null}
        </Pressable>
      </Modal>
    </ScreenShell>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: Radii.large,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: Spacing.two,
  },
  image: {
    width: '100%',
    aspectRatio: 1.25,
    borderRadius: Radii.medium,
    backgroundColor: theme.colors.surfaceSoft,
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  issuer: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    gap: Spacing.three,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1.35,
    borderRadius: Radii.medium,
  },
  });
}
