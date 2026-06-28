import { MapPin, MessageCircle } from "lucide-react-native";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/portfolio/screen-shell";
import {
  Card,
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
} from "@/components/portfolio/ui";
import { profile } from "@/constants/portfolio";
import { Spacing, type AppTheme } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";
import { openExternal } from "@/utils/actions";

const contactRows = [
  { label: "Phone", value: profile.phone, url: `tel:${profile.phone.replace(/[^\d+]/g, "")}` },
  { label: "Email", value: profile.email, url: `mailto:${profile.email}` },
  {
    label: "Location",
    value: profile.location,
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`,
  },
  { label: "GitHub", value: profile.github, url: profile.github },
  { label: "LinkedIn", value: profile.linkedin, url: profile.linkedin },
  { label: "Portfolio", value: profile.portfolio, url: profile.portfolio },
  { label: "Instagram", value: profile.instagram, url: profile.instagram },
  { label: "WhatsApp", value: profile.whatsapp, url: profile.whatsapp },
] as const;

export default function ContactScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScreenShell>
      <SectionHeader
        eyebrow="Connect"
        title="Contact"
        subtitle="Reach out through direct links or send a message from the form."
      />
      <Card>
        {contactRows.map((item) => (
          <ContactLinkRow key={item.label} label={item.label} value={item.value} url={item.url} />
        ))}
      </Card>

      <View style={styles.actions}>
        <PrimaryButton
          label="Open Maps"
          icon={MapPin}
          onPress={() =>
            openExternal("https://maps.app.goo.gl/7Rpc3B6QjPAmLUnDA")
          }
        />
        <SecondaryButton
          label="WhatsApp"
          icon={MessageCircle}
          onPress={() => openExternal(profile.whatsapp)}
        />
      </View>
    </ScreenShell>
  );
}

function ContactLinkRow({ label, value, url }: { label: string; value: string; url: string }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      onPress={() => Linking.openURL(url)}
      style={({ hovered, pressed }) => [styles.linkRow, pressed && styles.pressed]}>
      {({ hovered }) => (
        <>
          <Text style={styles.linkLabel}>{label}</Text>
          <Text style={[styles.linkValue, hovered && styles.linkValueHovered]}>{value}</Text>
        </>
      )}
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  linkRow: {
    gap: Spacing.one,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  linkLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  linkValue: {
    color: theme.colors.primary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  linkValueHovered: {
    textDecorationLine: "underline",
  },
  pressed: {
    opacity: 0.72,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  formTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  });
}
