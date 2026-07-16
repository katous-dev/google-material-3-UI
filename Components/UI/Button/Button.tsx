"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Button.module.scss";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonPadding = "baseline" | "recommended";
export type ButtonVariant = "elevated" | "filled" | "tonal" | "outlined" | "text";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode | IconName;
  trailingIcon?: React.ReactNode | IconName;
  size?: ButtonSize;
  padding?: ButtonPadding;
  variant?: ButtonVariant;
}

interface Ripple { id: number; x: number; y: number; size: number; }

function renderIcon(icon: React.ReactNode | IconName) {
  return typeof icon === "string" ? <Icon name={icon as IconName} /> : icon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { icon, trailingIcon, children, className, disabled, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, size = "md", padding = "baseline", variant = "filled", type = "button", ...rest },
  forwardedRef,
) {
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setRef = useCallback((node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const spawnRipple = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const element = buttonRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height) * 2.4;
    const id = counter.current++;
    setRipples((current) => [...current, { id, x: event.clientX - rect.left - rippleSize / 2, y: event.clientY - rect.top - rippleSize / 2, size: rippleSize }]);
    timers.current.push(setTimeout(() => setRipples((current) => current.filter((ripple) => ripple.id !== id)), 600));
  }, []);

  return <button
    {...rest}
    ref={setRef}
    type={type}
    disabled={disabled}
    className={[styles.button, styles[`size-${size}`], styles[variant], styles[`padding-${padding}`], pressed && styles.pressed, className].filter(Boolean).join(" ")}
    onPointerDown={(event) => { setPressed(true); event.currentTarget.setPointerCapture(event.pointerId); spawnRipple(event); onPointerDown?.(event); }}
    onPointerUp={(event) => { setPressed(false); onPointerUp?.(event); }}
    onPointerCancel={(event) => { setPressed(false); onPointerCancel?.(event); }}
    onPointerLeave={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) setPressed(false); onPointerLeave?.(event); }}
  >
    <span className={styles.ripples} aria-hidden="true">{ripples.map((ripple) => <span key={ripple.id} className={styles.ripple} style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />)}</span>
    <span className={styles.state} aria-hidden="true" />
    {icon && <span className={styles.icon}>{renderIcon(icon)}</span>}
    {children && <span className={styles.label}>{children}</span>}
    {trailingIcon && <span className={`${styles.icon} ${styles.trailing}`}>{renderIcon(trailingIcon)}</span>}
  </button>;
});
