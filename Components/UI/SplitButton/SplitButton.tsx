"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./SplitButton.module.scss";

export type SplitButtonVariant = "elevated" | "filled" | "tonal" | "outlined";
export type SplitButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SplitButtonProps {
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  icon?: React.ReactNode | IconName;
  label?: React.ReactNode;
  children?: React.ReactNode;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  onDropdown?: React.MouseEventHandler<HTMLButtonElement>;
  onMainAction?: React.MouseEventHandler<HTMLButtonElement>;
  onMenuAction?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  dropdownAriaLabel?: string;
}

interface Ripple { id: number; x: number; y: number; size: number; }

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const spawn = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const id = counter.current++;
    setRipples((current) => [...current, { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size }]);
    timers.current.push(setTimeout(() => setRipples((current) => current.filter((ripple) => ripple.id !== id)), 600));
  }, []);
  return { ripples, spawn };
}

function RippleLayer({ ripples }: { ripples: Ripple[] }) {
  return <span className={styles.ripples} aria-hidden="true">{ripples.map((ripple) => <span key={ripple.id} className={styles.ripple} style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />)}</span>;
}

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton({
  variant = "filled", size = "md", icon = "sparkle", label, children, onAction, onDropdown, onMainAction, onMenuAction, disabled = false, expanded, defaultExpanded = false, className, dropdownAriaLabel = "More options",
}, ref) {
  const [actionPressed, setActionPressed] = useState(false);
  const [dropdownPressed, setDropdownPressed] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded ?? internalExpanded;
  const actionRipple = useRipple();
  const dropdownRipple = useRipple();
  const content = label ?? children;
  const renderedIcon = typeof icon === "string" ? <Icon name={icon as IconName} /> : icon;

  return <div ref={ref} className={[styles.split, styles[variant], styles[size], disabled && styles.disabled, className].filter(Boolean).join(" ")}>
    <button type="button" className={`${styles.action} ${actionPressed ? styles.actionPressed : ""}`} disabled={disabled} onPointerDown={(event) => { setActionPressed(true); event.currentTarget.setPointerCapture(event.pointerId); actionRipple.spawn(event); }} onPointerUp={() => setActionPressed(false)} onPointerCancel={() => setActionPressed(false)} onClick={onAction ?? onMainAction}>
      <RippleLayer ripples={actionRipple.ripples} /><span className={styles.state} aria-hidden="true" />
      {renderedIcon && <span className={styles.icon}>{renderedIcon}</span>}{content && <span className={styles.label}>{content}</span>}
    </button>
    <span className={styles.divider} aria-hidden="true" />
    <button type="button" className={`${styles.dropdown} ${isExpanded ? styles.dropdownSelected : ""} ${dropdownPressed ? styles.dropdownPressed : ""}`} disabled={disabled} aria-label={dropdownAriaLabel} aria-haspopup="menu" aria-expanded={isExpanded} onPointerDown={(event) => { setDropdownPressed(true); event.currentTarget.setPointerCapture(event.pointerId); dropdownRipple.spawn(event); }} onPointerUp={() => setDropdownPressed(false)} onPointerCancel={() => setDropdownPressed(false)} onClick={(event) => { if (expanded === undefined) setInternalExpanded((current) => !current); (onDropdown ?? onMenuAction)?.(event); }}>
      <RippleLayer ripples={dropdownRipple.ripples} /><span className={styles.state} aria-hidden="true" /><span className={styles.chevron}><Icon name="chevron" /></span>
    </button>
  </div>;
});
