import { Hero } from "@/components/sections/Hero";
import { ProjectIntro } from "@/components/sections/ProjectIntro";
import { VisualShowcase } from "@/components/sections/VisualShowcase";
import { Connectivity } from "@/components/sections/Connectivity";
import { Specifications } from "@/components/sections/Specifications";
import { Amenities } from "@/components/sections/Amenities";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { Location } from "@/components/sections/Location";
import { Partners } from "@/components/sections/Partners";
import { Progress } from "@/components/sections/Progress";
import { Journey } from "@/components/sections/Journey";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Skip link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-[var(--gold)] focus:text-[var(--navy-deep)] focus:px-4 focus:py-2 focus:rounded focus:font-label focus:text-xs focus:tracking-widest focus:uppercase"
      >
        Skip to main content
      </a>

      {/* Hero is outside <main> intentionally — it's the full-screen billboard */}
      <Hero />

      <main id="main-content" className="min-h-screen bg-[var(--navy-deep)]">
        <ProjectIntro />
        <Connectivity />
        <Specifications />
        <Amenities />
        <VisualShowcase />
        <FloorPlans />
        <Location />
        <Partners />
        <Progress />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
