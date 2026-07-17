"use client";

import React, { useRef, useState, useCallback } from "react";
import styles from "./ExpressiveButton.module.scss";

// ─── Types ────────────────────────────────────────────────────
// Expressive Button — style imported từ mt3-gg-UI-master
// Đặt cạnh Material 3 Button chuẩn để so sánh.
// Lưu ý: chỉ 4 variants (không có "text"), dùng MouseEvent thay vì PointerEvent,
// hover rotate(-8deg) + scale(1.1), shadow chỉ trên elevated variant.
export type ExpressiveButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ExpressiveButtonPadding = "baseline" | "recommended";
export type ExpressiveButtonVariant = "elevated" | "filled" | "tonal" | "outlined";

export interface ExpressiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
  size?: ExpressiveButtonSize;
  padding?: ExpressiveButtonPadding;
  variant?: ExpressiveButtonVariant;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const ExpressiveButton = React.forwardRef<HTMLButtonElement, ExpressiveButtonProps>(
  function ExpressiveButton(
    {
      icon,
      trailingIcon,
      children,
      className,
      disabled,
      onMouseDown,
      size = "md",
      padding = "baseline",
      variant = "filled",
      type = "button",
      ...rest
    },
    forwardedRef
  ) {
    const [pressed, setPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const counter = useRef(0);
    const btnRef = useRef<HTMLButtonElement>(null);

    const setRef = useCallback((node: HTMLButtonElement | null) => {
      btnRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }, [forwardedRef]);

    const spawnRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.4;
      const id = counter.current++;
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
      ]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setPressed(true);
      spawnRipple(e);
      onMouseDown?.(e);
    };

    return (
      <button
        ref={setRef}
        type={type}
        disabled={disabled}
        className={[
          styles.btn,
          styles[`btn--${size}`],
          styles[`btn--${variant}`],
          styles[`btn--pad-${padding}`],
          pressed && styles["btn--pressed"],
          className,
        ].filter(Boolean).join(" ")}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        {...rest}
      >
        <span className={styles.btn__ripple} aria-hidden="true">
          {ripples.map(({ id, x, y, size }) => (
            <span
              key={id}
              className={styles.btn__ripple_wave}
              style={{ left: x, top: y, width: size, height: size }}
            />
          ))}
        </span>

        <span className={styles.btn__state} aria-hidden="true" />

        {icon && <span className={styles.btn__icon}>{icon}</span>}
        {children && <span className={styles.btn__label}>{children}</span>}
        {trailingIcon && (
          <span className={`${styles.btn__icon} ${styles["btn__icon--trail"]}`}>
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);

ExpressiveButton.displayName = "ExpressiveButton";
