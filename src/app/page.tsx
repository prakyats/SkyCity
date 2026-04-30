import { Hero } from "@/components/sections/Hero";
import { ProjectIntro } from "@/components/sections/ProjectIntro";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProjectIntro />
      {/* Additional sections will go here */}
    </main>
  );
}
