import React from 'react';

// Super lightweight charts using inline SVG so we don't add dependencies
// Props accept numeric arrays; colors adapt to theme.

export function LineChart({ data = [], height = 120, color = '#0ea5e9' }) {
  if (!data.length) return <div className="h-[120px] rounded-lg bg-slate-100 dark:bg-slate-800" />;
  const width = 320;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="w-full rounded-lg bg-slate-50 dark:bg-slate-800">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

export function DonutChart({ slices = [], size = 140, stroke = 14 }) {
  const total = slices.reduce((a, b) => a + b.value, 0) || 1;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  let acc = 0;

  return (
    <svg width={size} height={size} className="mx-auto block">
      {slices.map((s, i) => {
        const value = s.value / total;
        const dash = 2 * Math.PI * radius * value;
        const gap = 2 * Math.PI * radius - dash;
        const circle = (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-acc}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        );
        acc += dash;
        return circle;
      })}
      <circle cx={center} cy={center} r={radius} fill="transparent" stroke="rgba(148,163,184,0.25)" strokeWidth={stroke} />
    </svg>
  );
}
