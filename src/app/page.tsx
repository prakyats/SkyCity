import { ScrollStage } from "@/components/motion/ScrollStage";
import { Hero } from "@/components/sections/Hero";
import { Ascent } from "@/components/sections/Ascent";
import { Specifications } from "@/components/sections/Specifications";
import { Amenities } from "@/components/sections/Amenities";
import { Viewing } from "@/components/sections/Viewing";
import { VisualShowcase } from "@/components/sections/VisualShowcase";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { Connected } from "@/components/sections/Connected";
import { Explore3D } from "@/components/sections/Explore3D";
import { PeopleBehind } from "@/components/sections/PeopleBehind";
import { Progress } from "@/components/sections/Progress";
import { Journey } from "@/components/sections/Journey";
import { Contact } from "@/components/sections/Contact";

/**
 * One continuous passage, not a stack of sections.
 *
 * ScrollStage owns the only background on the page and interpolates it
 * between the palettes each passage declares, so the ground is always
 * mid-change and there is no edge anywhere to cross. Four passages pin
 * and convert scrolling into something else: climbing the tower, walking
 * the podium, wiping one image off another, riding the lift to a floor.
 *
 * The order is the visit. You arrive at altitude, come to understand the
 * building, walk its shared floors, pause, see how it was drawn, choose a
 * home, place it in the world, look further, meet who built it, see where
 * it has got to, and finally get asked for something.
 */
export default function Home() {
  return (
    <>
      <ScrollStage />

      <Hero />

      <main id="main-content" className="relative" style={{ zIndex: 1 }}>
        <Ascent />
        <Specifications />
        <Amenities />
        <Viewing />
        <VisualShowcase />
        <FloorPlans />
        <Connected />
        <Explore3D />
        <PeopleBehind />
        <Progress />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
