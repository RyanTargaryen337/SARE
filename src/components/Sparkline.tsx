import { useId } from 'react';

type Point = { label: string; value: number };

/**
 * Small area sparkline in plain SVG (replaces a 109 KB chart library for seven points).
 * The figure is described in text for screen readers; the drawing itself is decorative.
 */
export default function Sparkline({ data, summary, height = 140 }: { data: Point[]; summary: string; height?: number }) {
  const gradientId = useId();
  const w = 300;
  const h = height;
  const pad = { top: 8, bottom: 18 };
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const span = max - min || 1;
  const x = (i: number) => (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v: number) => pad.top + (1 - (v - min) / span) * (h - pad.top - pad.bottom);
  const line = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `M0,${h - pad.bottom} L${line.replace(/ /g, ' L')} L${w},${h - pad.bottom} Z`;

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F95E2C" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#F95E2C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <polyline points={line} fill="none" stroke="#F95E2C" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={h - 4} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fill="#B8AC9C" fontSize={10} fontFamily="JetBrains Mono">
            {d.label}
          </text>
        ))}
      </svg>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
