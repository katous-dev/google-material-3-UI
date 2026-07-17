"use client";

import React, { useRef, useState, useCallback } from "react";
import styles from "./ExpressiveToggleButton.module.scss";

// ─── Types ────────────────────────────────────────────────────
// Expressive ToggleButton — importer từ mt3-gg-UI-master
// Khác ToggleButton gốc (ActionButtons/ActionButtons.tsx):
//   - Hỗ trợ cả controlled (`selected`) & uncontrolled (`defaultSelected`)
//   - role="checkbox" + aria-checked (đúng chuẩn a11y cho toggle)
//   - Animation icon khi toggle (scale + rotate spring)
//   - Shape morph: border-radius thay đổi khi select
export type ExpressiveToggleButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ExpressiveToggleButtonPadding = "baseline" | "recommended";

export interface ExpressiveToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (selected: boolean) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  size?: ExpressiveToggleButtonSize;
  padding?: ExpressiveToggleButtonPadding;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const ExpressiveToggleButton = React.forwardRef<HTMLButtonElement, ExpressiveToggleButtonProps>(
  function ExpressiveToggleButton(
    {
      selected: controlled,
      defaultSelected = false,
      onChange,
      icon,
      children,
      className,
      disabled,
      onClick,
      size = "md",
      padding = "baseline",
      ...rest
    },
    forwardedRef
  ) {
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = useState(defaultSelected);
    const selected = isControlled ? controlled : internal;

    // Press & ripple
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

    const handleMouseDown = (_e: React.MouseEvent<HTMLButtonElement>) => {
      setPressed(true);
      spawnRipple(_e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = !selected;
      if (!isControlled) setInternal(next);
      onChange?.(next);
      onClick?.(e);
    };

    const cx = [
      styles.toggle,
      selected && styles["toggle--selected"],
      pressed && styles["toggle--pressed"],
      styles[`toggle--${size}`],
      styles[`toggle--pad-${padding}`],
      className,
    ].filter(Boolean).join(" ");

    return (
      <button
        ref={setRef}
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        className={cx}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={handleClick}
        {...rest}
      >
        <span className={styles.toggle__ripple} aria-hidden="true">
          {ripples.map(({ id, x, y, size }) => (
            <span
              key={id}
              className={styles.toggle__ripple_wave}
              style={{ left: x, top: y, width: size, height: size }}
            />
          ))}
        </span>
        <span className={styles.toggle__state} aria-hidden="true" />
        {icon && <span className={styles.toggle__icon}>{icon}</span>}
        {children && <span className={styles.toggle__label}>{children}</span>}
      </button>
    );
  }
);

ExpressiveToggleButton.displayName = "ExpressiveToggleButton";