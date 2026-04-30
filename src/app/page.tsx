import { Hero } from "@/components/sections/Hero";
import { ProjectIntro } from "@/components/sections/ProjectIntro";
import { VisualShowcase } from "@/components/sections/VisualShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProjectIntro />
      <VisualShowcase />
      {/* Additional sections will go here */}
    </main>
  );
}
