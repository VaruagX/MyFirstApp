import { Text } from "react-native";

import { ScreenShell } from "@/components/portfolio/screen-shell";
import {
  Card,
  FadeInView,
  SectionHeader,
  usePortfolioTextStyles,
} from "@/components/portfolio/ui";
import { experiences } from "@/constants/portfolio";
import { Spacing } from "@/constants/theme";

export default function ExperienceScreen() {
  const textStyles = usePortfolioTextStyles();

  return (
    <ScreenShell>
      <SectionHeader
        eyebrow="Work"
        title="Experience"
        subtitle="Professional and practical experience arranged as clean role cards."
      />
      {experiences.map((experience, index) => (
        <FadeInView
          key={`${experience.role}-${experience.company}`}
          delay={index * 80}
        >
          <Card style={{ gap: Spacing.two }}>
            <Text style={textStyles.cardTitle}>{experience.role}</Text>
            <Text style={textStyles.body}>
              {experience.company} • {experience.period}
            </Text>
            <Text style={textStyles.body}>{experience.detail}</Text>
          </Card>
        </FadeInView>
      ))}
    </ScreenShell>
  );
}
