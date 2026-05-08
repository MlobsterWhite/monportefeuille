import { useState } from "react";

// ─── Tooltip (used when tooltip prop is passed) ───────────────────────────────
function SliderTooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#21262D] border border-[#30363D] text-[#C9D1D9] text-[10px] rounded-lg px-3 py-2 z-50 leading-relaxed shadow-xl">
          {text}
        </span>
      )}
    </span>
  );
}

// ─── Shared Slider with click-to-edit ────────────────────────────────────────
// Props:
//   label      — label text
//   value      — current numeric value
//   min/max    — range bounds
//   step       — slider step
//   onChange   — (number) => void
//   display    — formatted string shown as the clickable value
//   color      — accent color for slider track, border, hover (default #F0A500)
//   tooltip    — optional tooltip text shown next to label
//   minLabel   — optional override for bottom-left label (defaults to auto-format)
//   maxLabel   — optional override for bottom-right label (defaults to auto-format)
export default function Slider({
  label, value, min, max, step, onChange, display,
  color = "#F0A500",
  tooltip,
  minLabel,
  maxLabel,
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  const autoLabel = (v) =>
    typeof v === "number" && v >= 1000
      ? "$" + Math.round(v).toLocaleString("fr-CA")
      : v;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-[#8B949E]">{label}</label>
          {tooltip && (
            <SliderTooltip text={tooltip}>
              <span className="text-[10px] text-[#484F58] border border-[#484F58] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center cursor-help">?</span>
            </SliderTooltip>
          )}
        </div>
        {editing ? (
          <input
            type="number" autoFocus value={raw} min={min} max={max}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => { const v = Math.min(max, Math.max(min, Number(raw) || value)); onChange(v); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(false); }}
            className="w-28 bg-[#0D1117] border rounded px-2 py-0.5 text-xs text-[#E6EDF3] text-right focus:outline-none"
            style={{ borderColor: color }}
          />
        ) : (
          <span
            onClick={() => { setRaw(value); setEditing(true); }}
            className="text-xs font-medium text-[#E6EDF3] tabular-nums cursor-pointer transition-colors border-b border-dashed border-[#484F58]"
            onMouseEnter={e => e.target.style.color = color}
            onMouseLeave={e => e.target.style.color = "#E6EDF3"}
            title="Cliquez pour modifier">
            {display}
          </span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer"
        style={{ accentColor: color }} />
      <div className="flex justify-between text-[10px] text-[#484F58] mt-1">
        <span>{minLabel !== undefined ? minLabel : autoLabel(min)}</span>
        <span>{maxLabel !== undefined ? maxLabel : autoLabel(max)}</span>
      </div>
    </div>
  );
}
