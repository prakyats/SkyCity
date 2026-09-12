import type { Metadata } from 'next';
import ModelViewerMount from '@/features/model-viewer/ModelViewerMount';

export const metadata: Metadata = {
  title: 'Explore the Model | Yamuna Sky City, Mangalore',
  description:
    'Turn, zoom and explore the Yamuna Sky City masterplan in 3D. View the towers, arrival plaza and amenity decks from any angle.',
  openGraph: {
    title: 'Explore Yamuna Sky City in 3D',
    description:
      'An interactive 360 degree model of the Yamuna Sky City masterplan, Mangalore.',
    type: 'website',
  },
};

/**
 * The 3D experience, on its own route.
 *
 * This page is deliberately separate from the homepage scroll. The viewer
 * wants the wheel for zoom and the whole viewport for the model, neither of
 * which sits comfortably inside a continuous scroll narrative. Keeping it
 * here means the homepage keeps its pacing and its bundle.
 */
export default function ExplorePage() {
  return (
    <main
      // Small viewport height units, so mobile browser chrome collapsing does
      // not leave a gap under the canvas.
      style={{ height: '100svh', minHeight: '100svh', width: '100%' }}
    >
      <ModelViewerMount />
    </main>
  );
}
