import { cn } from "@/lib/utils";

interface BottleIllustrationProps {
  volume: number;
  accent?: string | null;
  label?: string;
  material?: string;
  className?: string;
}

/**
 * Procedural SVG bottle used when no product photography has been uploaded yet.
 * The silhouette adapts to the volume (slim, standard, family, jug) and the
 * label picks up the product accent colour.
 */
export function BottleIllustration({ volume, accent, label, material = "PET", className }: BottleIllustrationProps) {
  const color = accent || "#13A8CE";
  const id = `b${volume}${color.replace("#", "")}${material}`;
  const glass = material === "Glass";

  // width of the body (viewBox is 200 x 400)
  const shape =
    volume >= 5000
      ? { body: 128, shoulder: 150, neck: 34, labelY: 230, labelH: 90, handle: true }
      : volume >= 1000
        ? { body: 86, shoulder: 120, neck: 26, labelY: 220, labelH: 76, handle: false }
        : volume >= 600
          ? { body: 74, shoulder: 140, neck: 22, labelY: 225, labelH: 70, handle: false }
          : { body: 70, shoulder: 150, neck: 24, labelY: 228, labelH: 64, handle: false };

  const cx = 100;
  const half = shape.body / 2;
  const neckHalf = shape.neck / 2;
  const top = 46;
  const bottom = 384;

  const outline = `
    M ${cx - neckHalf} ${top}
    L ${cx - neckHalf} ${top + 30}
    C ${cx - neckHalf} ${top + 60}, ${cx - half} ${shape.shoulder - 40}, ${cx - half} ${shape.shoulder}
    L ${cx - half} ${bottom - 22}
    Q ${cx - half} ${bottom}, ${cx - half + 18} ${bottom}
    L ${cx + half - 18} ${bottom}
    Q ${cx + half} ${bottom}, ${cx + half} ${bottom - 22}
    L ${cx + half} ${shape.shoulder}
    C ${cx + half} ${shape.shoulder - 40}, ${cx + neckHalf} ${top + 60}, ${cx + neckHalf} ${top + 30}
    L ${cx + neckHalf} ${top} Z`;

  return (
    <svg viewBox="0 0 200 400" role="img" aria-label={label} className={cn("h-full w-auto drop-shadow-[0_30px_40px_rgb(7_59_89/0.25)]", className)}>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor={glass ? "#2f7a5c" : "#bfe9f4"} stopOpacity={glass ? 0.85 : 0.95} />
          <stop offset="0.35" stopColor={glass ? "#8fd1b5" : "#ffffff"} stopOpacity="0.9" />
          <stop offset="0.7" stopColor={glass ? "#3f8f6e" : "#d6f3fa"} stopOpacity="0.9" />
          <stop offset="1" stopColor={glass ? "#1d5a42" : "#8dd9e9"} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8DD9E9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#13A8CE" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-label`} x1="0" x2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="0.5" stopColor={color} stopOpacity="0.85" />
          <stop offset="1" stopColor="#073B59" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={outline} />
        </clipPath>
      </defs>

      {shape.handle && (
        <path
          d={`M ${cx + neckHalf + 4} ${top + 46} C ${cx + half + 26} ${top + 46}, ${cx + half + 26} ${shape.shoulder + 10}, ${cx + half - 6} ${shape.shoulder + 14}`}
          fill="none"
          stroke="#bfe9f4"
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}

      {/* cap */}
      <rect x={cx - neckHalf - 4} y={top - 30} width={shape.neck + 8} height="34" rx="6" fill="#073B59" />
      <rect x={cx - neckHalf - 4} y={top - 6} width={shape.neck + 8} height="6" fill="#0f4d70" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={cx - neckHalf + i * ((shape.neck + 4) / 6)} y={top - 26} width="1.5" height="18" fill="#2d6a8c" />
      ))}

      {/* bottle */}
      <path d={outline} fill={`url(#${id}-glass)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />

      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y={shape.shoulder - 10} width="200" height="400" fill={`url(#${id}-water)`} />
        {/* ribs */}
        {[0.25, 0.4].map((r) => (
          <path
            key={r}
            d={`M ${cx - half} ${shape.shoulder + (bottom - shape.shoulder) * r} Q ${cx} ${shape.shoulder + (bottom - shape.shoulder) * r + 8}, ${cx + half} ${shape.shoulder + (bottom - shape.shoulder) * r}`}
            stroke="#ffffff"
            strokeOpacity="0.5"
            fill="none"
          />
        ))}
        {/* label */}
        <rect x="0" y={shape.labelY} width="200" height={shape.labelH} fill={`url(#${id}-label)`} />
        <path
          d={`M 0 ${shape.labelY + shape.labelH * 0.62} C 50 ${shape.labelY + shape.labelH * 0.45}, 120 ${shape.labelY + shape.labelH * 0.85}, 200 ${shape.labelY + shape.labelH * 0.6} L 200 ${shape.labelY + shape.labelH} L 0 ${shape.labelY + shape.labelH} Z`}
          fill="#ffffff"
          fillOpacity="0.16"
        />
        <circle cx={cx} cy={shape.labelY + shape.labelH * 0.38} r="9" fill="#ffffff" fillOpacity="0.9" />
        <path
          d={`M ${cx} ${shape.labelY + shape.labelH * 0.38 - 6} q 5 6 0 11 q -5 -5 0 -11`}
          fill={color}
        />
        {/* highlight */}
        <rect x={cx - half + 8} y={shape.shoulder - 20} width="10" height={bottom - shape.shoulder} rx="5" fill="#ffffff" fillOpacity="0.55" />
        <rect x={cx + half - 22} y={shape.shoulder} width="4" height={bottom - shape.shoulder - 40} rx="2" fill="#ffffff" fillOpacity="0.35" />
      </g>
    </svg>
  );
}
