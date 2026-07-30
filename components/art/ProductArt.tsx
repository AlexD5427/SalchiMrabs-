import type { ArtVariant } from '@/lib/types';

interface ProductArtProps {
  variant: ArtVariant;
  hue: number;
  chroma?: number;
  seed?: string;
  className?: string;
  detail?: boolean;
}

/** Deterministic pseudo-random so server and client draw the same speckles. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967295;
  };
}

const PATHS: Record<ArtVariant, string[]> = {
  curve: ['M60 210 C60 120 140 78 220 96 C300 114 352 176 340 118'],
  twin: [
    'M56 168 C72 96 158 66 232 88 C296 107 330 152 348 126',
    'M60 232 C86 174 168 148 240 170 C300 189 330 216 348 196',
  ],
  link: [
    'M52 200 C52 158 84 138 116 152',
    'M132 150 C168 132 204 148 208 188',
    'M226 188 C232 144 268 126 300 146',
    'M314 152 C346 172 352 208 336 232',
  ],
  coil: [
    'M204 60 C120 60 66 116 66 176 C66 236 124 274 196 274 C258 274 300 240 300 196 C300 156 268 130 224 130 C188 130 162 152 162 180 C162 204 180 220 204 220',
  ],
  sliced: ['M74 168 C90 108 176 82 246 106 C298 124 322 164 340 140'],
  skewer: ['M92 176 H310'],
  board: ['M84 150 C112 106 190 96 244 122', 'M96 214 C130 174 208 168 262 194'],
  ring: ['M200 76 A100 100 0 1 1 199 76'],
};

/**
 * Every product "photograph" is drawn, not shot: a stroked casing with a
 * gradient skin, marbling speckles, char marks and a soft cast shadow.
 * Deterministic, zero network weight, animatable by CSS.
 */
export function ProductArt({
  variant,
  hue,
  chroma = 0.16,
  seed = 'salchimrabs',
  className,
  detail = true,
}: ProductArtProps) {
  const random = rng(`${seed}-${variant}`);
  const id = `${seed}-${variant}`.replace(/[^a-z0-9-]/gi, '');
  const paths = PATHS[variant];

  const skin = `oklch(58% ${chroma} ${hue})`;
  const skinDeep = `oklch(38% ${chroma * 0.9} ${hue})`;
  const skinLift = `oklch(76% ${chroma * 0.7} ${hue + 8})`;

  const speckles = Array.from({ length: detail ? 26 : 12 }, () => ({
    x: 48 + random() * 300,
    y: 70 + random() * 200,
    r: 1.4 + random() * 3.4,
    o: 0.16 + random() * 0.4,
  }));

  const width = variant === 'skewer' ? 30 : variant === 'link' ? 40 : 46;

  return (
    <svg
      viewBox="0 0 400 320"
      className={`art ${className ?? ''}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`skin-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={skinLift} />
          <stop offset="46%" stopColor={skin} />
          <stop offset="100%" stopColor={skinDeep} />
        </linearGradient>
        <linearGradient id={`sheen-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(97% 0.02 90)" stopOpacity="0.75" />
          <stop offset="70%" stopColor="oklch(97% 0.02 90)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={skin} stopOpacity="0.42" />
          <stop offset="100%" stopColor={skin} stopOpacity="0" />
        </radialGradient>
        <filter id={`rough-${id}`} x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.026" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Masks respect strokes, clip paths do not: the casing is all stroke. */}
        <mask id={`mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="320">
          {paths.map((d, index) => (
            <path
              key={index}
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={width}
              strokeLinecap="round"
            />
          ))}
        </mask>
      </defs>

      <ellipse cx="200" cy="160" rx="175" ry="130" fill={`url(#halo-${id})`} className="art__halo" />
      <ellipse cx="206" cy="286" rx="128" ry="14" fill="oklch(24% 0.03 40)" opacity="0.16" className="art__shadow" />

      {variant === 'skewer' ? (
        <path d="M28 176 H372" stroke="oklch(72% 0.05 84)" strokeWidth="5" strokeLinecap="round" fill="none" />
      ) : null}

      {variant === 'board' ? (
        <g>
          <rect x="48" y="88" width="304" height="152" rx="22" fill="oklch(64% 0.05 62)" opacity="0.28" />
          <rect
            x="48"
            y="88"
            width="304"
            height="152"
            rx="22"
            fill="none"
            stroke="oklch(46% 0.05 60)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      ) : null}

      <g className="art__body" filter={detail ? `url(#rough-${id})` : undefined}>
        {paths.map((d, index) => (
          <path
            key={`skin-${index}`}
            d={d}
            fill="none"
            stroke={`url(#skin-${id})`}
            strokeWidth={width}
            strokeLinecap="round"
          />
        ))}

        <g mask={`url(#mask-${id})`}>
          {speckles.map((dot, index) => (
            <circle
              key={`spot-${index}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="oklch(94% 0.02 88)"
              opacity={dot.o}
            />
          ))}
          <g opacity="0.3" stroke="oklch(24% 0.02 40)" strokeWidth="3.5" strokeLinecap="round">
            <path d="M96 96 L132 250" />
            <path d="M188 74 L214 262" />
            <path d="M276 88 L302 258" />
          </g>
        </g>

        {paths.map((d, index) => (
          <path
            key={`sheen-${index}`}
            d={d}
            fill="none"
            stroke={`url(#sheen-${id})`}
            strokeWidth={width * 0.32}
            strokeLinecap="round"
            transform={`translate(0 ${-width * 0.22})`}
            opacity="0.5"
          />
        ))}
      </g>

      {variant === 'sliced' ? (
        <g className="art__slices">
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(${112 + index * 74} 254) rotate(${-8 + index * 7})`}>
              <ellipse rx="30" ry="11" fill={skinDeep} />
              <ellipse rx="26" ry="8.5" fill={skin} />
              <ellipse rx="14" ry="4.5" fill="oklch(88% 0.04 80)" opacity="0.5" />
            </g>
          ))}
        </g>
      ) : null}

      {variant === 'ring' ? (
        <path
          d="M186 66 C196 52 214 52 224 66"
          fill="none"
          stroke="oklch(84% 0.03 84)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
