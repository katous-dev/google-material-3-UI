"use client";

import { useState } from "react";
import styles from "./MaterialSlider.module.scss";

export function MaterialSlider({ label = "Value", initialValue = 54 }: { label?: string; initialValue?: number }) {
  const [value, setValue] = useState(initialValue);
  return <label className={styles.wrap}><span>{label}<b>{value}</b></span><div className={styles.slider} style={{ "--value": `${value}%` } as React.CSSProperties}><div className={styles.active} /><div className={styles.handle} /><div className={styles.inactive} /><input aria-label={label} type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} /></div></label>;
}

export function RangeSlider() {
  const [start, setStart] = useState(24);
  const [end, setEnd] = useState(78);
  return <div className={styles.wrap}><span>Range<b>{start} - {end}</b></span><div className={styles.range} style={{ "--start": `${start}%`, "--end": `${end}%` } as React.CSSProperties}><div /><input aria-label="Range start" type="range" min="0" max="100" value={start} onChange={(e) => setStart(Math.min(Number(e.target.value), end - 5))} /><input aria-label="Range end" type="range" min="0" max="100" value={end} onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 5))} /></div></div>;
}
