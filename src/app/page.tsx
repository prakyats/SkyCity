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
    <main className="min-h-screen bg-[var(--navy-deep)]">
      <Hero />
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
      {/* Additional sections will go here */}
    </main>
  );
}