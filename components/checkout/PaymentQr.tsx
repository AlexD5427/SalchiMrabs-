/** Deterministic QR-style block: reads as a bank QR without pretending to be one. */
export function PaymentQr({ code, hue = 200 }: { code: string; hue?: number }) {
  let seed = 7;
  for (let i = 0; i < code.length; i += 1) seed = (seed * 31 + code.charCodeAt(i)) % 100000;

  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const size = 17;
  const cells: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (next() > 0.52) cells.push({ x, y });
    }
  }

  const anchor = (x: number, y: number) => (
    <g key={`a-${x}-${y}`}>
      <rect x={x} y={y} width="5" height="5" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="3" height="3" fill="var(--surface)" />
      <rect x={x + 2} y={y + 2} width="1" height="1" fill="currentColor" />
    </g>
  );

  return (
    <div className="qr" style={{ ['--accent' as string]: `oklch(58% 0.1 ${hue})` }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`QR ${code}`}>
        {cells
          .filter(({ x, y }) => !((x < 6 && y < 6) || (x > size - 7 && y < 6) || (x < 6 && y > size - 7)))
          .map(({ x, y }) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
          ))}
        {anchor(0, 0)}
        {anchor(size - 5, 0)}
        {anchor(0, size - 5)}
      </svg>
      <span className="qr__code mono">{code}</span>
    </div>
  );
}
