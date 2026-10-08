import { AREAS, VENDORS } from '../lib/data';
import type { Rider, Order } from '../lib/sim';

const ROADS: [string, string][] = [
  ['festac', 'surulere'], ['surulere', 'yaba'], ['surulere', 'oshodi'], ['oshodi', 'ikeja'],
  ['oshodi', 'maryland'], ['ikeja', 'maryland'], ['maryland', 'yaba'], ['yaba', 'ikoyi'],
  ['ikoyi', 'vi'], ['vi', 'lekki'], ['lekki', 'ajah'], ['ikoyi', 'vi'], ['yaba', 'vi'],
];

interface Props {
  riders: Rider[];
  highlightOrder?: Order | null;
  compact?: boolean;
  className?: string;
}

const A = (id: string) => AREAS.find((a) => a.id === id)!;

export default function LagosMap({ riders, highlightOrder, compact, className }: Props) {
  const hotVendor = highlightOrder ? VENDORS.find((v) => v.id === highlightOrder.vendorId) : null;
  const hotFrom = hotVendor ? A(hotVendor.area) : null;
  const hotTo = highlightOrder ? A(highlightOrder.areaId) : null;
  const hotRider = highlightOrder?.riderId ? riders.find((r) => r.id === highlightOrder.riderId) : null;

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="lagosGlow" cx="50%" cy="55%" r="70%">
          <stop offset="0%" stopColor="#1F503F" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#022F2A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#lagosGlow)" />
      {/* lagoon */}
      <path d="M42,86 Q60,80 78,84 Q92,86 100,80 L100,100 L38,100 Q36,92 42,86 Z" fill="#0a3f4a" opacity="0.65" />
      {!compact && <text x="70" y="94" fontSize="2.6" fill="#3d7a8a" fontFamily="JetBrains Mono, monospace" letterSpacing="0.4">LAGOS LAGOON</text>}

      {/* roads */}
      {ROADS.map(([a, b], i) => (
        <line key={i} x1={A(a).x} y1={A(a).y} x2={A(b).x} y2={A(b).y}
          stroke="#E9DFD3" strokeOpacity="0.10" strokeWidth="0.35" strokeDasharray="1.2 0.9" />
      ))}

      {/* highlighted route */}
      {hotFrom && hotTo && (
        <line x1={hotFrom.x} y1={hotFrom.y} x2={hotTo.x} y2={hotTo.y}
          stroke="#F95E2C" strokeWidth="0.6" strokeDasharray="2 1.4" strokeOpacity="0.9">
          <animate attributeName="stroke-dashoffset" from="34" to="0" dur="2.4s" repeatCount="indefinite" />
        </line>
      )}

      {/* areas */}
      {AREAS.map((a) => (
        <g key={a.id}>
          <circle cx={a.x} cy={a.y} r="1.1" fill="#022F2A" stroke="#E9DFD3" strokeOpacity="0.5" strokeWidth="0.25" />
          {!compact && (
            <text x={a.x + 1.8} y={a.y + 0.9} fontSize="2.3" fill="#B8AC9C"
              fontFamily="JetBrains Mono, monospace" letterSpacing="0.12">{a.name.toUpperCase()}</text>
          )}
        </g>
      ))}

      {/* vendor pins */}
      {VENDORS.map((v) => {
        const a = A(v.area);
        const hot = hotVendor?.id === v.id;
        return (
          <g key={v.id}>
            {hot && <circle cx={a.x} cy={a.y} r="3" fill="none" stroke="#F95E2C" strokeWidth="0.4">
              <animate attributeName="r" values="2;4.5;2" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.9;0.1;0.9" dur="1.6s" repeatCount="indefinite" />
            </circle>}
            <rect x={a.x - 1.2} y={a.y - 3.4} width="2.4" height="2.4" rx="0.5"
              fill={hot ? '#F95E2C' : '#1F503F'} stroke="#E9DFD3" strokeOpacity="0.4" strokeWidth="0.2" transform={`rotate(45 ${a.x} ${a.y - 2.2})`} />
          </g>
        );
      })}

      {/* customer drop */}
      {hotTo && (
        <g>
          <circle cx={hotTo.x} cy={hotTo.y} r="2.6" fill="none" stroke="#34d399" strokeWidth="0.4">
            <animate attributeName="r" values="1.6;3.6;1.6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={hotTo.x} cy={hotTo.y} r="1" fill="#34d399" />
        </g>
      )}

      {/* riders — smooth 1s linear transitions driven by the sim tick */}
      {riders.filter((r) => r.online).map((r) => {
        const hot = hotRider?.id === r.id;
        const color = r.status === 'idle' ? '#B8AC9C' : hot ? '#F95E2C' : '#34d399';
        return (
          <g key={r.id} style={{ transform: `translate(${r.x}px, ${r.y}px)`, transition: 'transform 0.95s linear' }}>
            {r.status !== 'idle' && (
              <circle r="2.4" fill="none" stroke={color} strokeWidth="0.3">
                <animate attributeName="r" values="1.2;3;1.2" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.8;0.05;0.8" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r={hot ? 1.4 : 1.1} fill={color} stroke="#022F2A" strokeWidth="0.3" />
          </g>
        );
      })}
    </svg>
  );
}
