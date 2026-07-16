"use client";

import React, { useEffect, useId, useRef } from "react";
import styles from "./Progress.module.scss";

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

export type CpiSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CpiVariant = "wavy" | "standard";

export interface CircularProgressIndicatorProps {
  variant?: CpiVariant;
  size?: CpiSize;
  state?: "determinate" | "indeterminate";
  value?: number;
  spinning?: boolean;
  className?: string;
  "aria-label"?: string;
}

const LINEAR_VIEWBOX_WIDTH = 404;
const LINEAR_VIEWBOX_HEIGHT = 14;
const LINEAR_TILE_WIDTH = 40;
const LINEAR_TILE_HEIGHT = 12;
const LINEAR_WAVE_TILE_D =
  "M6.05859 3.57003C4.16427 2.43344 1.70723 3.0477 0.570641 4.94202C-0.565952 6.83634 0.0483055 9.29338 1.94263 10.43L4.00061 7L6.05859 3.57003ZM24.0006 7L21.9426 3.57003C17.0542 6.50311 10.9471 6.50311 6.05859 3.57003L4.00061 7L1.94263 10.43C9.36456 14.8831 18.6367 14.8831 26.0586 10.43L24.0006 7ZM24.0006 7L26.0586 10.43C30.9471 7.49689 37.0542 7.49689 41.9426 10.43L44.0006 7L46.0586 3.57003C38.6367 -0.883127 29.3646 -0.883127 21.9426 3.57003L24.0006 7Z";

function LinearWaveTile({ delay }: { delay: number }) {
  return (
    <span className={styles.waveSegment} style={{ animationDelay: `${delay}ms` }}>
      <svg className={styles.linearWaveSvg} viewBox="0 0 48 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d={LINEAR_WAVE_TILE_D} fill="currentColor" />
      </svg>
    </span>
  );
}

const CX = 50;
const CY = 50;
const R = 38;
const STROKE_W = 14;
const WAVE_AMPLITUDE = 3.5;
const WAVE_DEG = 50;
const SAMPLE_DEG = 5;
const ROT_DEG_S = 230;
const CYCLE_S = 1.6;
const MIN_SWEEP = 40;
const MAX_SWEEP = 240;
const GROW_K = 60;
const GROW_D = 16;
const WAVE_PHASE_DEG_S = 150;
const SPIN_SWEEP = 230;

function wavyArcPath(tailDeg: number, sweep: number, phaseOffsetDeg = 0): string {
  if (sweep < 1) return "";
  const n = Math.max(4, Math.ceil(sweep / SAMPLE_DEG));
  const pts: [number, number][] = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const rad = (tailDeg + t * sweep - 90) * (Math.PI / 180);
    const phase = ((sweep / WAVE_DEG) * t + phaseOffsetDeg / WAVE_DEG) * Math.PI * 2;
    const radius = R + WAVE_AMPLITUDE * Math.sin(phase);
    pts.push([CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)]);
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

function smoothArcPath(tailDeg: number, sweep: number): string {
  if (sweep >= 359.5) {
    return `M${CX},${(CY - R).toFixed(2)} A${R},${R} 0 1 1 ${(CX - 0.001).toFixed(3)},${(CY - R).toFixed(2)}Z`;
  }
  if (sweep < 0.5) return "";
  const tail = (tailDeg - 90) * (Math.PI / 180);
  const head = (tailDeg + sweep - 90) * (Math.PI / 180);
  return `M${(CX + R * Math.cos(tail)).toFixed(2)},${(CY + R * Math.sin(tail)).toFixed(2)} A${R},${R} 0 ${sweep > 180 ? 1 : 0} 1 ${(CX + R * Math.cos(head)).toFixed(2)},${(CY + R * Math.sin(head)).toFixed(2)}`;
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
  const isIndeterminate = mode === "indeterminate";
  const activePercent = appearance === "wave"
    ? (isIndeterminate ? 50 : clamped)
    : (isIndeterminate ? 20 : clamped);
  const tileCount = appearance === "wave"
    ? Math.max(2, Math.ceil((activePercent / 100) * (LINEAR_VIEWBOX_WIDTH / LINEAR_TILE_WIDTH)) + 1)
    : 1;
  const rootClass = appearance === "wave" ? styles.rootWave : styles.rootDeterminate;

  return (
    <div
      className={[
        styles.root,
        rootClass,
        className,
      ].filter(Boolean).join(" ")}
      role="progressbar"
      aria-valuenow={!isIndeterminate ? clamped : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      style={style}
    >
      <div className={styles.active} style={{ flexBasis: `${activePercent}%` }}>
        {appearance === "wave" ? (
          <div className={[styles.waveStrip, isIndeterminate && styles.waveStripIndeterminate].filter(Boolean).join(" ")}>
            {Array.from({ length: tileCount }, (_, index) => (
              <LinearWaveTile key={index} delay={index * 110} />
            ))}
          </div>
        ) : (
          <div className={[styles.standardBar, isIndeterminate && styles.standardBarIndeterminate].filter(Boolean).join(" ")} />
        )}
      </div>

      <div className={styles.trackAndStop}>
        {trackVisible && <div className={styles.track} />}
        {stopIndicator && <div className={styles.stop} />}
      </div>
    </div>
  );
}

export const CircularProgress = React.memo<CircularProgressIndicatorProps>(
  ({
    variant = "wavy",
    size = "md",
    state,
    value,
    spinning = false,
    className,
    "aria-label": ariaLabel = "Loading",
  }) => {
    const indicatorRef = useRef<SVGPathElement>(null);
    const rafRef = useRef<number>(0);
    const prevTsRef = useRef<number>(0);
    const rotRef = useRef<number>(0);
    const sweepRef = useRef<number>(0);
    const sweepVelRef = useRef<number>(0);
    const phaseRef = useRef<number>(0);

    const indeterminate = state ? state === "indeterminate" : value === undefined;
    const isWavy = variant === "wavy";

    useEffect(() => {
      const el = indicatorRef.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);
      prevTsRef.current = 0;

      if (spinning) {
        el.setAttribute("d", isWavy ? wavyArcPath(-90, SPIN_SWEEP) : smoothArcPath(-90, SPIN_SWEEP));
        return undefined;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const target = indeterminate ? 0.75 : Math.max(0, Math.min(1, value ?? 0));
        el.setAttribute("d", isWavy ? wavyArcPath(-90, target * 360) : smoothArcPath(-90, target * 360));
        return undefined;
      }

      if (indeterminate) {
        let startTs = 0;
        const tick = (ts: number) => {
          if (!startTs) startTs = ts;
          const dt = prevTsRef.current ? Math.min((ts - prevTsRef.current) / 1000, 0.05) : 0.016;
          prevTsRef.current = ts;

          rotRef.current = (rotRef.current + ROT_DEG_S * dt) % 360;
          const p = 0.5 - 0.5 * Math.cos((((ts - startTs) / 1000 / CYCLE_S) % 1) * Math.PI * 2);
          const sweep = MIN_SWEEP + (MAX_SWEEP - MIN_SWEEP) * p;

          el.setAttribute("d", isWavy ? wavyArcPath(rotRef.current - sweep, sweep) : smoothArcPath(rotRef.current - sweep, sweep));
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
      }

      const targetSweep = Math.max(0, Math.min(1, value ?? 0)) * 360;
      const tick = (ts: number) => {
        const dt = prevTsRef.current ? Math.min((ts - prevTsRef.current) / 1000, 0.05) : 0.016;
        prevTsRef.current = ts;

        const force = -GROW_K * (sweepRef.current - targetSweep);
        sweepVelRef.current += (force - GROW_D * sweepVelRef.current) * dt;
        sweepRef.current += sweepVelRef.current * dt;
        sweepRef.current = Math.max(0, sweepRef.current);
        phaseRef.current = (phaseRef.current + WAVE_PHASE_DEG_S * dt) % (WAVE_DEG * 2);

        el.setAttribute("d", isWavy ? wavyArcPath(-90, sweepRef.current, phaseRef.current) : smoothArcPath(-90, sweepRef.current));
        rafRef.current = requestAnimationFrame(tick);
      };

      if (sweepRef.current === 0 && targetSweep === 0) {
        el.setAttribute("d", "");
        return undefined;
      }

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, [indeterminate, value, isWavy, spinning]);

    return (
      <div
        className={[
          styles.cpi,
          styles[`cpi--${size}`],
          className,
        ].filter(Boolean).join(" ")}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={!indeterminate && !spinning ? Math.round((value ?? 0) * 100) : undefined}
        aria-valuemin={!indeterminate && !spinning ? 0 : undefined}
        aria-valuemax={!indeterminate && !spinning ? 100 : undefined}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={[
            styles.cpi__svg,
            spinning && styles["cpi__svg--spinning"],
          ].filter(Boolean).join(" ")}
          aria-hidden="true"
        >
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={STROKE_W}
            className={styles.cpi__track}
          />
          <path
            ref={indicatorRef}
            fill="none"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.cpi__indicator}
            d=""
          />
        </svg>
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";
