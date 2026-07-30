interface MeterProps {
  label: string;
  value: number;
  max?: number;
  tone?: 'heat' | 'smoke';
}

export function Meter({ label, value, max = 3, tone = 'heat' }: MeterProps) {
  return (
    <div className="meter" data-tone={tone}>
      <span className="meter__label mono">{label}</span>
      <span className="meter__pips" role="img" aria-label={`${label}: ${value}/${max}`}>
        {Array.from({ length: max }, (_, index) => (
          <span key={index} className="meter__pip" data-on={index < value ? 'true' : 'false'} />
        ))}
      </span>
    </div>
  );
}
