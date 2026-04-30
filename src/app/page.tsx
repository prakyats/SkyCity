import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* Spacer to demonstrate scroll parallax */}
      <div className="h-[150vh] bg-white flex items-center justify-center">
        <p className="text-gray-500 font-medium">Scroll down to see the hero parallax effect</p>
      </div>
    </main>
  );
}
