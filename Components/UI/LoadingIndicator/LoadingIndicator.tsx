"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LoadingIndicator.module.scss";

export type LoadingIndicatorSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoadingIndicatorVariant = "contained" | "default";

export interface LoadingIndicatorProps {
  variant?: LoadingIndicatorVariant;
  size?: LoadingIndicatorSize;
  className?: string;
  "aria-label"?: string;
}

const SHAPES_RAW: readonly [number, number][][] = [
  [
    [67.55, 25.39], [70.96, 25.8], [73.4, 27.52], [74.41, 30.09], [74.69, 33.75], [74.91, 36.97], [75.64, 40.08], [77.68, 42.58],
    [79.8, 45.01], [81.93, 47.7], [82.44, 50.64], [81.34, 53.18], [78.95, 55.96], [76.83, 58.4], [75.14, 61.11], [74.82, 64.33],
    [74.61, 67.55], [74.2, 70.96], [72.48, 73.4], [69.91, 74.41], [66.25, 74.69], [63.03, 74.91], [59.92, 75.64], [57.42, 77.68],
    [54.99, 79.8], [52.3, 81.93], [49.36, 82.44], [46.82, 81.34], [44.04, 78.95], [41.6, 76.83], [38.89, 75.14], [35.67, 74.82],
    [32.45, 74.6], [29.04, 74.2], [26.6, 72.48], [25.59, 69.91], [25.31, 66.25], [25.09, 63.03], [24.36, 59.92], [22.32, 57.42],
    [20.2, 54.99], [18.07, 52.3], [17.56, 49.36], [18.66, 46.82], [21.05, 44.04], [23.17, 41.6], [24.86, 38.89], [25.18, 35.67],
    [25.39, 32.45], [25.8, 29.05], [27.52, 26.6], [30.09, 25.59], [33.75, 25.31], [36.97, 25.09], [40.08, 24.36], [42.58, 22.32],
    [45.01, 20.2], [47.7, 18.07], [50.64, 17.56], [53.18, 18.66], [55.96, 21.05], [58.4, 23.17], [61.11, 24.86], [64.33, 25.18],
  ],
  [
    [35.69, 27.1], [37.99, 25.05], [40.47, 23.32], [43.08, 21.9], [45.81, 20.8], [48.61, 20.01], [51.48, 19.55], [54.37, 19.39],
    [57.26, 19.56], [60.12, 20.04], [62.92, 20.84], [65.65, 21.96], [68.25, 23.39], [70.71, 25.15], [73.01, 27.21], [75.04, 29.52],
    [76.76, 32], [78.17, 34.62], [79.25, 37.34], [80.02, 40.16], [80.47, 43.02], [80.61, 45.92], [80.43, 48.81], [79.93, 51.67],
    [79.1, 54.47], [77.98, 57.18], [76.53, 59.79], [74.76, 62.24], [72.69, 64.52], [70.6, 66.62], [68.51, 68.71], [66.4, 70.8],
    [64.31, 72.9], [62.01, 74.95], [59.53, 76.68], [56.92, 78.1], [54.19, 79.2], [51.39, 79.99], [48.52, 80.45], [45.63, 80.61],
    [42.74, 80.44], [39.88, 79.96], [37.08, 79.16], [34.35, 78.04], [31.75, 76.61], [29.29, 74.85], [26.99, 72.79], [24.96, 70.48],
    [23.24, 68], [21.83, 65.38], [20.75, 62.66], [19.98, 59.84], [19.53, 56.98], [19.39, 54.08], [19.57, 51.19], [20.07, 48.33],
    [20.9, 45.53], [22.02, 42.82], [23.47, 40.21], [25.24, 37.76], [27.31, 35.48], [29.4, 33.38], [31.49, 31.29], [33.6, 29.2],
  ],
  [
    [23.89, 50], [22.71, 47.32], [21.95, 44.42], [21.65, 41.36], [21.86, 38.17], [22.59, 35.08], [23.78, 32.21], [25.39, 29.6],
    [27.37, 27.29], [29.69, 25.31], [32.3, 23.72], [35.16, 22.55], [38.25, 21.85], [41.43, 21.67], [44.47, 21.99], [47.35, 22.79],
    [50.01, 24], [52.67, 22.8], [55.53, 22.01], [58.58, 21.67], [61.75, 21.85], [64.84, 22.55], [67.7, 23.71], [70.3, 25.3],
    [72.62, 27.28], [74.61, 29.59], [76.22, 32.2], [77.41, 35.07], [78.14, 38.17], [78.34, 41.36], [78.05, 44.42], [77.29, 47.32],
    [76.11, 50], [77.29, 52.68], [78.05, 55.58], [78.34, 58.64], [78.14, 61.83], [77.41, 64.93], [76.22, 67.8], [74.61, 70.41],
    [72.62, 72.72], [70.3, 74.7], [67.7, 76.29], [64.84, 77.45], [61.75, 78.15], [58.58, 78.33], [55.53, 77.99], [52.67, 77.2],
    [50.01, 76], [47.35, 77.21], [44.47, 78.01], [41.43, 78.33], [38.25, 78.15], [35.16, 77.45], [32.3, 76.28], [29.69, 74.69],
    [27.37, 72.71], [25.39, 70.4], [23.78, 67.79], [22.59, 64.92], [21.86, 61.83], [21.65, 58.64], [21.95, 55.58], [22.71, 52.68],
  ],
  [
    [46.97, 18.88], [50.23, 17.3], [53.29, 19.27], [55.39, 22.43], [57.86, 25.22], [61.55, 25.07], [65.1, 23.72], [68.82, 22.98],
    [71.44, 25.37], [71.4, 29.14], [71.17, 32.94], [73.21, 35.9], [76.9, 36.88], [80.61, 37.84], [82.68, 40.74], [81.08, 44.05],
    [78.6, 46.91], [77.02, 50.23], [78.9, 53.44], [81.38, 56.29], [82.62, 59.69], [80.14, 62.33], [76.46, 63.23], [72.8, 64.33],
    [71.18, 67.53], [71.44, 71.32], [71.27, 75.07], [68.36, 77.1], [64.66, 76.12], [61.13, 74.77], [57.46, 75], [55.13, 77.95],
    [53.03, 81.11], [49.77, 82.7], [46.71, 80.73], [44.61, 77.57], [42.14, 74.78], [38.45, 74.93], [34.9, 76.28], [31.18, 77.02],
    [28.56, 74.64], [28.6, 70.86], [28.83, 67.06], [26.79, 64.1], [23.09, 63.12], [19.39, 62.16], [17.32, 59.25], [18.92, 55.95],
    [21.4, 53.09], [22.98, 49.77], [21.1, 46.56], [18.62, 43.71], [17.38, 40.31], [19.86, 37.67], [23.54, 36.77], [27.2, 35.68],
    [28.82, 32.47], [28.56, 28.69], [28.73, 24.93], [31.64, 22.9], [35.34, 23.88], [38.88, 25.23], [42.54, 25], [44.87, 22.05],
  ],
  [
    [43.34, 21.25], [45.93, 19.55], [48.85, 18.74], [51.85, 18.85], [54.71, 19.88], [57.22, 21.69], [59.93, 23.11], [62.9, 23.64],
    [66, 23.96], [68.78, 25.17], [71.05, 27.13], [72.66, 29.71], [73.48, 32.7], [74.55, 35.56], [76.42, 37.97], [78.61, 40.15],
    [80.06, 42.82], [80.67, 45.77], [80.38, 48.79], [79.18, 51.65], [78.07, 54.48], [77.85, 57.53], [78.18, 60.6], [77.73, 63.64],
    [76.42, 66.34], [74.36, 68.55], [71.77, 70.04], [68.95, 71.44], [66.76, 73.55], [65.07, 76.15], [62.84, 78.26], [60.15, 79.59],
    [57.17, 80.04], [54.16, 79.56], [51.17, 78.76], [48.12, 78.87], [45.17, 79.76], [42.11, 80.02], [39.19, 79.35], [36.58, 77.83],
    [34.51, 75.54], [32.78, 73], [30.45, 71.05], [27.65, 69.79], [25.09, 68.09], [23.2, 65.74], [22.08, 62.95], [21.84, 59.87],
    [22.19, 56.81], [21.74, 53.79], [20.46, 50.98], [19.47, 48.09], [19.4, 45.06], [20.2, 42.16], [21.86, 39.59], [24.09, 37.46],
    [25.78, 34.93], [26.68, 31.91], [27.64, 29.06], [29.43, 26.6], [31.84, 24.81], [34.71, 23.8], [37.79, 23.6], [40.74, 22.86],
  ],
  [
    [40.36, 21.96], [43.41, 19.65], [45.61, 18.27], [48.13, 17.47], [51.13, 17.36], [53.9, 18.05], [55.99, 19.22], [58.76, 21.28],
    [61.44, 23.35], [63.83, 25.19], [66.22, 27.05], [68.67, 28.82], [71.11, 30.6], [73.93, 32.64], [76.57, 34.67], [78.25, 36.34],
    [79.71, 38.85], [80.52, 41.74], [80.58, 44.46], [80.06, 46.92], [78.97, 50.37], [77.95, 53.46], [77, 56.33], [76.06, 59.21],
    [75.19, 62.11], [74.33, 65], [73.3, 68.4], [72.29, 71.51], [71.27, 73.6], [69.34, 75.85], [66.85, 77.52], [64.38, 78.35],
    [61.75, 78.56], [57.94, 78.53], [54.92, 78.47], [51.89, 78.43], [48.87, 78.42], [45.85, 78.47], [42.83, 78.51], [39.09, 78.57],
    [36.2, 78.44], [33.84, 77.83], [31.24, 76.34], [29.14, 74.17], [27.96, 72.1], [26.97, 69.31], [25.9, 65.73], [25.04, 62.83],
    [24.17, 59.93], [23.25, 57.06], [22.3, 54.18], [21.34, 51.31], [20.17, 47.67], [19.5, 45.02], [19.41, 42.5], [20.02, 39.55],
    [21.37, 36.87], [22.94, 35.1], [25.29, 33.22], [28.28, 31.05], [30.72, 29.27], [33.17, 27.49], [35.58, 25.66], [37.97, 23.81],
  ],
];

function normalizeShape(pts: [number, number][]): [number, number][] {
  const count = pts.length;
  const centerX = pts.reduce((sum, point) => sum + point[0], 0) / count;
  const centerY = pts.reduce((sum, point) => sum + point[1], 0) / count;
  const avgRadius = pts.reduce((sum, point) => sum + Math.hypot(point[0] - centerX, point[1] - centerY), 0) / count;
  const scale = 30 / avgRadius;

  return pts.map(([x, y]) => [
    (x - centerX) * scale + 50,
    (y - centerY) * scale + 50,
  ] as [number, number]);
}

const SHAPES = SHAPES_RAW.map(normalizeShape);

const N = 64;
const TOTAL = SHAPES.length;
const SHAPE_K = 55;
const SHAPE_D = 16;
const SETTLE_THR = N * 0.04;
const DWELL_MS = 100;
const ROT_SLOW = 10;
const ROT_FAST = 250;
const LERP_UP = 0.1;
const LERP_DOWN = 0.1;

function buildPath(buf: Float64Array): string {
  const format = (value: number) => value.toFixed(2);
  let d = `M${format(buf[0])},${format(buf[2])}`;

  for (let i = 0; i < N; i++) {
    const base = i * 4;
    const next = ((i + 1) % N) * 4;
    const prev = ((i - 1 + N) % N) * 4;
    const next2 = ((i + 2) % N) * 4;

    const c1x = buf[base] + (buf[next] - buf[prev]) / 6;
    const c1y = buf[base + 2] + (buf[next + 2] - buf[prev + 2]) / 6;
    const c2x = buf[next] - (buf[next2] - buf[base]) / 6;
    const c2y = buf[next + 2] - (buf[next2 + 2] - buf[base + 2]) / 6;

    d += ` C${format(c1x)},${format(c1y)} ${format(c2x)},${format(c2y)} ${format(buf[next])},${format(buf[next + 2])}`;
  }

  return `${d}Z`;
}

export const LoadingIndicator = React.memo<LoadingIndicatorProps>(
  ({
    variant = "contained",
    size = "md",
    className,
    "aria-label": ariaLabel = "Loading",
  }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const rafRef = useRef<number>(0);
    const prevTsRef = useRef<number>(0);
    const dwellRef = useRef<number>(0);
    const idxRef = useRef<number>(0);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const bufRef = useRef<Float64Array>(
      (() => {
        const buffer = new Float64Array(N * 4);
        for (let i = 0; i < N; i++) {
          buffer[i * 4] = SHAPES[0][i][0];
          buffer[i * 4 + 1] = 0;
          buffer[i * 4 + 2] = SHAPES[0][i][1];
          buffer[i * 4 + 3] = 0;
        }
        return buffer;
      })()
    );

    const targetRef = useRef<Float64Array>(
      Float64Array.from(SHAPES[0].flatMap(([x, y]) => [x, y]))
    );

    const rotAngleRef = useRef(0);
    const rotSpeedRef = useRef(ROT_SLOW);

    useEffect(() => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");

      const updatePreference = () => setPrefersReducedMotion(media.matches);
      updatePreference();

      if (media.addEventListener) {
        media.addEventListener("change", updatePreference);
        return () => media.removeEventListener("change", updatePreference);
      }

      media.addListener(updatePreference);
      return () => media.removeListener(updatePreference);
    }, []);

    const buildTarget = useCallback((idx: number) => {
      const shape = SHAPES[idx];
      const target = targetRef.current;
      const buffer = bufRef.current;

      for (let i = 0; i < N; i++) {
        target[i * 2] = shape[i][0];
        target[i * 2 + 1] = shape[i][1];
        buffer[i * 4 + 1] = 0;
        buffer[i * 4 + 3] = 0;
      }
    }, []);

    const animate = useCallback((ts: number) => {
      const el = pathRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const dt = prevTsRef.current
        ? Math.min((ts - prevTsRef.current) / 1000, 0.05)
        : 0.016;
      prevTsRef.current = ts;

      const buffer = bufRef.current;
      const target = targetRef.current;

      let totalVel = 0;
      for (let i = 0; i < N; i++) {
        const base = i * 4;
        const tx = target[i * 2];
        const ty = target[i * 2 + 1];

        buffer[base + 1] += (-SHAPE_K * (buffer[base] - tx) - SHAPE_D * buffer[base + 1]) * dt;
        buffer[base] += buffer[base + 1] * dt;
        buffer[base + 3] += (-SHAPE_K * (buffer[base + 2] - ty) - SHAPE_D * buffer[base + 3]) * dt;
        buffer[base + 2] += buffer[base + 3] * dt;

        totalVel += Math.abs(buffer[base + 1]) + Math.abs(buffer[base + 3]);
      }

      const isMorphing = totalVel > SETTLE_THR;
      const targetSpeed = isMorphing ? ROT_FAST : ROT_SLOW;
      rotSpeedRef.current += (targetSpeed - rotSpeedRef.current) * (isMorphing ? LERP_UP : LERP_DOWN);
      const speed = Math.max(ROT_SLOW, rotSpeedRef.current);

      rotAngleRef.current = (rotAngleRef.current + speed * dt) % 360;

      el.setAttribute("d", buildPath(buffer));
      el.setAttribute("transform", `rotate(${rotAngleRef.current.toFixed(2)},50,50)`);

      if (!isMorphing) {
        dwellRef.current += dt * 1000;
        if (dwellRef.current >= DWELL_MS) {
          dwellRef.current = 0;
          idxRef.current = (idxRef.current + 1) % TOTAL;
          buildTarget(idxRef.current);
        }
      } else {
        dwellRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(animate);
    }, [buildTarget]);

    useEffect(() => {
      buildTarget(0);
      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildPath(bufRef.current));
        if (prefersReducedMotion) {
          pathRef.current.removeAttribute("transform");
        }
      }

      if (prefersReducedMotion) {
        return undefined;
      }

      rafRef.current = requestAnimationFrame((ts) => {
        prevTsRef.current = ts;
        rafRef.current = requestAnimationFrame(animate);
      });

      return () => cancelAnimationFrame(rafRef.current);
    }, [animate, buildTarget, prefersReducedMotion]);

    return (
      <div
        className={[
          styles.loader,
          styles[`loader--${size}`],
          className,
        ].filter(Boolean).join(" ")}
        role="status"
        aria-label={ariaLabel}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.loader__svg}
          aria-hidden="true"
        >
          {variant === "contained" && (
            <circle cx="50" cy="50" r="50" className={styles.loader__container} />
          )}
          <path ref={pathRef} className={styles.loader__indicator} />
        </svg>
      </div>
    );
  }
);

LoadingIndicator.displayName = "LoadingIndicator";
