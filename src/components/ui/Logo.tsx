import React from 'react';

/**
 * The Yamuna Sky City identity, as supplied artwork.
 *
 * Three lockups and four colourways, each its own file. The width is
 * always derived from the height and the artwork's own aspect, so the
 * logo cannot be stretched by a careless style, and no variant is ever
 * produced by recolouring another with a CSS filter.
 *
 * Pick the variant from the surface, not from taste:
 *   primary   ember artwork, for the pale surfaces
 *   dark      white artwork, for ink and photography
 *   reversed  ivory artwork, for the ember block
 *   mono      black artwork, single-colour reproduction only
 */
export type LogoType = 'mark' | 'wordmark' | 'lockup';
export type LogoVariant = 'primary' | 'reversed' | 'dark' | 'mono';

/** Intrinsic sizes of the supplied files, which fix each aspect ratio. */
const INTRINSIC: Record<LogoType, { w: number; h: number }> = {
  mark: { w: 1666, h: 1360 },
  wordmark: { w: 1936, h: 576 },
  lockup: { w: 2106, h: 750 },
};

type Props = {
  type?: LogoType;
  variant?: LogoVariant;
  /** Rendered height in px. Width follows from the artwork. */
  height?: number;
  /** Height as a CSS length, for type that should scale with the viewport. */
  cssHeight?: string;
  className?: string;
  /** Decorative by default; give it a label when it is the only naming. */
  label?: string;
  priority?: boolean;
};

export const Logo = ({
  type = 'lockup',
  variant = 'primary',
  height = 40,
  cssHeight,
  className = '',
  label,
  priority = false,
}: Props) => {
  const { w, h } = INTRINSIC[type];
  const ratio = w / h;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/media/brand/${type}-${variant}.png`}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      width={w}
      height={h}
      className={className}
      style={
        cssHeight
          // Height drives it and the aspect holds the width, so a fluid
          // height stays undistorted without a second clamp to maintain.
          ? { height: cssHeight, width: 'auto', aspectRatio: `${w} / ${h}` }
          : { height, width: Math.round(height * ratio) }
      }
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
};
