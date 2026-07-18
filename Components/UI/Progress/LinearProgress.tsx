"use client";

import React, { useEffect, useRef } from "react";
import styles from "./LinearProgress.module.scss";

export type LinearProgressVariant = "determinate" | "indeterminate";

export interface LinearProgressIndicatorProps {
  variant?: LinearProgressVariant;
  state?: LinearProgressVariant;
  appearance?: "standard" | "wave";
  value?: number;
  trackVisible?: boolean;
  stopIndicator?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// === Wave shape constants (copy pattern từ Circular determinate) ===
const WAVE_VIEWBOX_W = 1000;
const WAVE_VIEWBOX_H = 12;
const WAVE_AMPLITUDE = 3.5;
const WAVE_DEG = 50;
const SAMPLE_DEG = 4;
const CYCLE_S = 1.6;
const MIN_SWEEP = 25;
const MAX_SWEEP = 100;
const GROW_K = 60;
const GROW_D = 16;
const WAVE_PHASE_DEG_S = 150;

function waveLinearPath(activeLenPct: number, sweep: number, phaseOffsetDeg = 0): string {
  const filledPct = Math.max(0, Math.min(100, sweep));
  if (filledPct < 0.5) return "";
  const filledLen = WAVE_VIEWBOX_W * (filledPct / 100);
  if (filledLen < 1) return "";

  const n = Math.max(4, Math.ceil(filledLen / SAMPLE_DEG));
  const pts: [number, number][] = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = t * filledLen;
    const phase = ((x / WAVE_DEG) + phaseOffsetDeg / WAVE_DEG) * Math.PI * 2;
    const y = WAVE_VIEWBOX_H / 2 + WAVE_AMPLITUDE * Math.sin(phase);
    pts.push([x, y]);
  }

  return catmullRom(pts);
}

function catmullRom(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return "";
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;

  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const t = 1 / 6;
    d += ` C${f(p1[0] + (p2[0] - p0[0]) * t)},${f(p1[1] + (p2[1] - p0[1]) * t)} ${f(p2[0] - (p3[0] - p1[0]) * t)},${f(p2[1] - (p3[1] - p1[1]) * t)} ${f(p2[0])},${f(p2[1])}`;
  }

  return d;
}

function LinearWaveTile({ delay }: { delay: number }) {
  return (
    <span className={styles.waveSegment} style={{ animationDelay: `${delay}ms` }}>
      <svg className={styles.linearWaveSvg} viewBox="0 0 48 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6.05859 3.57003C4.16427 2.43344 1.70723 3.0477 0.570641 4.94202C-0.565952 6.83634 0.0483055 9.29338 1.94263 10.43L4.00061 7L6.05859 3.57003ZM24.0006 7L21.9426 3.57003C17.0542 6.50311 10.9471 6.50311 6.05859 3.57003L4.00061 7L1.94263 10.43C9.36456 14.8831 18.6367 14.8831 26.0586 10.43L24.0006 7ZM24.0006 7L26.0586 10.43C30.9471 7.49689 37.0542 7.49689 41.9426 10.43L44.0006 7L46.0586 3.57003C38.6367 -0.883127 29.3646 -0.883127 21.9426 3.57003L24.0006 7Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function LinearProgress({
  variant = "determinate",
  state,
  appearance = "standard",
  value = 0,
  trackVisible = true,
  stopIndicator = true,
  className,
  style,
}: LinearProgressIndicatorProps) {
  const mode = state ?? variant;
  const clamped = Math.min(100, Math.max(0, value));
  const waveValue = clamped * 100;
  const isIndeterminate = mode === "indeterminate";
  const isWave = appearance === "wave";

  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);
  const prevTsRef = useRef<number>(0);
  const sweepRef = useRef<number>(0);
  const sweepVelRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  const rootClass = [
    styles.root,
    isWave ? styles.rootWave : styles.rootDeterminate,
    className,
  ].filter(Boolean).join(" ");

  // === Wave animation (rAF loop, copy pattern từ Circular) ===
  useEffect(() => {
    if (!isWave) return;
    const el = pathRef.current;
    if (!el) return;

    cancelAnimationFrame(rafRef.current);
    prevTsRef.current = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const target = isIndeterminate ? 75 : waveValue;
      el.setAttribute("d", waveLinearPath(target, target));
      return;
    }

    if (isIndeterminate) {
      let startTs = 0;
      const tick = (ts: number) => {
        if (!startTs) startTs = ts;
        const dt = prevTsRef.current ? Math.min((ts - prevTsRef.current) / 1000, 0.05) : 0.016;
        prevTsRef.current = ts;

        const p = 0.5 - 0.5 * Math.cos((((ts - startTs) / 1000 / CYCLE_S) % 1) * Math.PI * 2);
        const sweep = MIN_SWEEP + (MAX_SWEEP - MIN_SWEEP) * p;
        phaseRef.current = (phaseRef.current + WAVE_PHASE_DEG_S * dt) % (WAVE_DEG * 2);

        el.setAttribute("d", waveLinearPath(100, sweep, phaseRef.current));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }

    const targetSweep = waveValue;
    const tick = (ts: number) => {
      const dt = prevTsRef.current ? Math.min((ts - prevTsRef.current) / 1000, 0.05) : 0.016;
      prevTsRef.current = ts;

      const force = -GROW_K * (sweepRef.current - targetSweep);
      sweepVelRef.current += (force - GROW_D * sweepVelRef.current) * dt;
      sweepRef.current += sweepVelRef.current * dt;
      sweepRef.current = Math.max(0, sweepRef.current);
      phaseRef.current = (phaseRef.current + WAVE_PHASE_DEG_S * dt) % (WAVE_DEG * 2);

      el.setAttribute("d", waveLinearPath(100, sweepRef.current, phaseRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (sweepRef.current === 0 && targetSweep === 0) {
      el.setAttribute("d", "");
      return undefined;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isWave, isIndeterminate, clamped, waveValue]);

  // === Layout: 3 absolute children GIỐNG Standard ===
  const GAP_PX = 4;
  const activeWidthStyle = `calc((100% - 16px) * ${clamped})`;
  const trackLeftStyle = `calc(4px + (100% - 16px) * ${clamped} + ${GAP_PX}px)`;

  return (
    <div
      className={rootClass}
      role="progressbar"
      aria-valuenow={!isIndeterminate ? clamped : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      style={style}
    >
      {isWave ? (
        <>
          <div
            className={[styles.activeIndicator, styles.activeIndicatorWave].filter(Boolean).join(" ")}
            style={isIndeterminate ? undefined : { width: activeWidthStyle }}
          >
            <svg
              viewBox={`0 0 ${WAVE_VIEWBOX_W} ${WAVE_VIEWBOX_H}`}
              preserveAspectRatio="xMinYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.waveSvg}
              aria-hidden="true"
            >
              <path
                ref={pathRef}
                fill="none"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.waveSvgPath}
                d=""
              />
            </svg>
          </div>
          {trackVisible && (
            <div className={styles.track} style={{ left: trackLeftStyle }} />
          )}
          {stopIndicator && <div className={styles.stop} />}
        </>
      ) : (
        <>
          <div
            className={[
              styles.activeIndicator,
              isIndeterminate && styles.activeIndicatorIndeterminate,
            ].filter(Boolean).join(" ")}
            style={{ width: isIndeterminate ? undefined : activeWidthStyle }}
          />
          {trackVisible && (
            <div className={styles.track} style={{ left: trackLeftStyle }} />
          )}
          {stopIndicator && <div className={styles.stop} />}
        </>
      )}
    </div>
  );
}
