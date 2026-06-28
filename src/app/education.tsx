import { ScreenShell } from "@/components/portfolio/screen-shell";
import {
  FadeInView,
  SectionHeader,
  TimelineCard,
} from "@/components/portfolio/ui";
import { academicTimeline } from "@/constants/portfolio";

export default function EducationScreen() {
  return (
    <ScreenShell>
      <FadeInView>
        <SectionHeader
          eyebrow="Academic Journey"
          title="Education Timeline"
          subtitle="School, higher secondary, B.Tech, current semester, and grades."
        />
      </FadeInView>

      {academicTimeline.map((item, index) => (
        <FadeInView key={item.title} delay={index * 80}>
          <TimelineCard {...item} />
        </FadeInView>
      ))}
    </ScreenShell>
  );
}
