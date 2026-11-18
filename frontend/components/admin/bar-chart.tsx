"use client";

import { useState } from "react";

export interface Series {
  key: string;
  label: string;
  color: string;
}

/**
 * Small dependency-free SVG column chart (single or stacked series).
 * Thin bars with 4px rounded data-ends, 2px gaps between stacked segments,
 * recessive gridlines, legend for >= 2 series and a per-column hover tooltip.
 */
export function ColumnChart({ data, series, labelKey, height = 220, formatLabel }: { data: Record<string, number | string>[]; series: Series[]; labelKey: string; height?: number; formatLabel: (v: string) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map((d) => series.reduce((s, x) => s + Number(d[x.key] ?? 0), 0));
  const max = Math.max(1, ...totals);
  // Round tick step to 1 / 2 / 5 × 10^n so gridlines land on readable values.
  const rawStep = max / 4;
  const mag = 10 ** Math.floor(Math.log10(Math.max(rawStep, 1)));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= rawStep) ?? mag * 10;
  const niceMax = Math.max(4, step * 4);
  const w = 720;
  const pad = { top: 12, bottom: 26, start: 36 };
  const plotH = height - pad.top - pad.bottom;
  const col = (w - pad.start) / data.length;
  const barW = Math.max(3, Math.min(22, col * 0.6));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));
  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="relative" dir="ltr">
      {series.length > 1 && (
        <ul className="mb-3 flex justify-end gap-4 text-xs text-muted" dir="rtl">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => {
          const y = pad.top + plotH - (t / niceMax) * plotH;
          return (
            <g key={t}>
              <line x1={pad.start} x2={w} y1={y} y2={y} stroke="#dde9ef" strokeWidth={t === 0 ? 1 : 0.6} />
              <text x={pad.start - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#5b7486">
                {fmt(t)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = pad.start + i * col + (col - barW) / 2;
          let y = pad.top + plotH;
          const segments = series.map((s, si) => {
            const v = Number(d[s.key] ?? 0);
            const h = (v / niceMax) * plotH;
            const gap = si > 0 && h > 0 ? 2 : 0;
            y -= h;
            const isTop = series.slice(si + 1).every((n) => Number(d[n.key] ?? 0) === 0);
            const r = isTop ? Math.min(4, barW / 2, h) : 0;
            const top = y;
            const bottom = y + h - gap;
            if (h <= 0) return null;
            return (
              <path
                key={s.key}
                d={`M${x},${bottom} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${bottom} Z`}
                fill={s.color}
                opacity={hover === null || hover === i ? 1 : 0.45}
              />
            );
          });
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={pad.start + i * col} y={pad.top} width={col} height={plotH} fill="transparent" />
              {segments}
              {(i === 0 || i === data.length - 1 || (i % Math.ceil(data.length / 6) === 0 && data.length - 1 - i > data.length / 12)) && (
                <text
                  x={i === data.length - 1 ? x + barW : i === 0 ? x : x + barW / 2}
                  y={height - 8}
                  textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"}
                  fontSize="10"
                  fill="#5b7486"
                >
                  {formatLabel(String(d[labelKey]))}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-8 z-10 min-w-36 -translate-x-1/2 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-lift"
          style={{ left: `${((pad.start + hover * col + col / 2) / w) * 100}%` }}
          dir="rtl"
        >
          <p className="font-semibold text-deep-600">{formatLabel(String(data[hover][labelKey]))}</p>
          {series.map((s) => (
            <p key={s.key} className="mt-1 flex items-center justify-between gap-3 text-ink">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-semibold">{fmt(Number(data[hover][s.key] ?? 0))}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
