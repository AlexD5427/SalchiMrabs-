interface SceneArtProps {
  hue: number;
  variant?: 'oven' | 'chamber' | 'table' | 'smoke';
  className?: string;
}

/**
 * Editorial imagery, drawn. Layered light instead of stock photography:
 * every scene reacts to the section accent and animates for free.
 */
export function SceneArt({ hue, variant = 'oven', className }: SceneArtProps) {
  const id = `${variant}-${Math.round(hue)}`;
  const warm = `oklch(64% 0.15 ${hue})`;
  const deep = `oklch(28% 0.08 ${hue})`;
  const cool = `oklch(52% 0.07 ${(hue + 170) % 360})`;

  return (
    <svg
      viewBox="0 0 600 760"
      className={`scene ${className ?? ''}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={deep} />
          <stop offset="58%" stopColor={`oklch(20% 0.03 ${hue})`} />
          <stop offset="100%" stopColor="oklch(14% 0.02 40)" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="64%" r="52%">
          <stop offset="0%" stopColor={warm} stopOpacity="0.9" />
          <stop offset="60%" stopColor={warm} stopOpacity="0.22" />
          <stop offset="100%" stopColor={warm} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`rim-${id}`} cx="22%" cy="18%" r="48%">
          <stop offset="0%" stopColor={cool} stopOpacity="0.5" />
          <stop offset="100%" stopColor={cool} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="760" fill={`url(#bg-${id})`} />
      <rect width="600" height="760" fill={`url(#rim-${id})`} />

      {variant === 'oven' ? (
        <g>
          <rect x="56" y="186" width="488" height="420" rx="18" fill="oklch(18% 0.02 40)" />
          <rect x="92" y="226" width="416" height="300" rx="10" fill={`url(#glow-${id})`} />
          <g stroke="oklch(76% 0.04 80)" strokeWidth="2" opacity="0.32">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M${118 + i * 58} 226 V526`} />
            ))}
          </g>
          <g opacity="0.9">
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${140 + i * 82} 300 C${128 + i * 82} 372 ${168 + i * 82} 400 ${152 + i * 82} 466`}
                fill="none"
                stroke={`oklch(${52 + i * 4}% 0.14 ${hue + i * 6})`}
                strokeWidth="22"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>
      ) : null}

      {variant === 'chamber' ? (
        <g>
          <rect x="70" y="120" width="460" height="540" rx="14" fill="oklch(22% 0.02 220)" opacity="0.7" />
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i} transform={`translate(${118 + i * 74} 150)`}>
                <path d="M0 0 V54" stroke="oklch(80% 0.03 84)" strokeWidth="2" />
                <path
                  d={`M0 54 C-14 130 16 210 0 ${300 + (i % 3) * 46}`}
                  fill="none"
                  stroke={`oklch(${44 + (i % 3) * 8}% 0.12 ${hue - 6 + i * 5})`}
                  strokeWidth="28"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
          <rect x="70" y="120" width="460" height="540" rx="14" fill={`url(#glow-${id})`} opacity="0.4" />
        </g>
      ) : null}

      {variant === 'table' ? (
        <g>
          <ellipse cx="300" cy="460" rx="250" ry="180" fill={`url(#glow-${id})`} />
          <rect x="90" y="330" width="420" height="250" rx="26" fill="oklch(38% 0.05 62)" opacity="0.85" />
          <g>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M${140 + i * 92} 386 C${132 + i * 92} 430 ${176 + i * 92} 452 ${158 + i * 92} 522`}
                fill="none"
                stroke={`oklch(${50 + i * 6}% 0.15 ${hue + i * 14})`}
                strokeWidth="26"
                strokeLinecap="round"
              />
            ))}
          </g>
          <g fill="oklch(92% 0.03 88)" opacity="0.5">
            <circle cx="186" cy="352" r="5" />
            <circle cx="362" cy="344" r="4" />
            <circle cx="438" cy="372" r="6" />
          </g>
        </g>
      ) : null}

      {variant === 'smoke' ? (
        <g opacity="0.85">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path
              key={i}
              d={`M${60 + i * 68} 700 C${20 + i * 68} 560 ${120 + i * 68} 460 ${60 + i * 68} 300 C${30 + i * 68} 200 ${100 + i * 68} 150 ${70 + i * 68} 60`}
              fill="none"
              stroke={`oklch(${70 - i * 3}% 0.03 ${hue})`}
              strokeWidth={2 + (i % 3)}
              opacity={0.16 + (i % 4) * 0.08}
            />
          ))}
          <ellipse cx="300" cy="620" rx="220" ry="120" fill={`url(#glow-${id})`} />
        </g>
      ) : null}
    </svg>
  );
}
