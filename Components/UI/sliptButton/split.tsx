"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./split.module.scss";

export type SplitButtonVariant = "elevated" | "filled" | "tonal" | "outlined";
export type SplitButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SplitButtonMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  trailingText?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  onDropdown?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  actionAriaLabel?: string;
  dropdownAriaLabel?: string;
  menuId?: string;
  menuItems?: SplitButtonMenuItem[];
  menuAriaLabel?: string;
}

interface Ripple { id: number; x: number; y: number; size: number; }

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const spawn = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const id = counter.current++;
    setRipples((current) => [...current, { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size }]);
    const timer = setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
      timers.current.delete(id);
    }, 600);
    timers.current.set(id, timer);
  }, []);

  return { ripples, spawn };
}

function RippleLayer({ ripples }: { ripples: Ripple[] }) {
  return <span className={styles.split__ripple} aria-hidden="true">{ripples.map(({ id, x, y, size }) => <span key={id} className={styles.split__ripple_wave} style={{ left: x, top: y, width: size, height: size }} />)}</span>;
}

const ChevronDown = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ChevronUp = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton({
  variant = "filled", size = "md", icon, label, onAction, onDropdown, disabled = false,
  expanded, defaultExpanded = false, onExpandedChange, actionAriaLabel, dropdownAriaLabel = "More options", menuId, menuItems = [], menuAriaLabel = "Related actions", className, ...rest
}, ref) {
  const [actionPressed, setActionPressed] = useState(false);
  const [dropdownPressed, setDropdownPressed] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const generatedMenuId = useId();
  const resolvedMenuId = menuId ?? `split-menu-${generatedMenuId.replace(/:/g, "")}`;
  const hasMenu = menuItems.length > 0;
  const isExpanded = hasMenu && (expanded ?? internalExpanded);
  const actionRipple = useRipple();
  const dropdownRipple = useRipple();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const setExpanded = useCallback((nextExpanded: boolean) => {
    if (expanded === undefined) setInternalExpanded(nextExpanded);
    onExpandedChange?.(nextExpanded);
  }, [expanded, onExpandedChange]);

  useEffect(() => {
    if (!isExpanded) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setExpanded(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setExpanded(false);
      dropdownRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isExpanded, setExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    const frame = requestAnimationFrame(() => itemRefs.current.find((item) => item && !item.disabled)?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isExpanded]);

  const beginPress = (event: React.PointerEvent<HTMLButtonElement>, setPressed: (value: boolean) => void, spawn: (event: React.PointerEvent<HTMLButtonElement>) => void) => {
    setPressed(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    spawn(event);
  };

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasMenu) setExpanded(!isExpanded);
    onDropdown?.(event);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const enabledItems = itemRefs.current.filter((item) => item && !item.disabled) as HTMLButtonElement[];
    if (!enabledItems.length) return;
    const currentIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? enabledItems.length - 1 : event.key === "ArrowDown" ? (currentIndex + 1) % enabledItems.length : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    enabledItems[nextIndex]?.focus();
  };

  return <div ref={setRootRef} className={[styles.split, styles[`split--${variant}`], styles[`split--${size}`], disabled && styles["split--disabled"], className].filter(Boolean).join(" ")} {...rest}>
    <button type="button" className={[styles.split__action, actionPressed && styles["split__action--pressed"]].filter(Boolean).join(" ")} disabled={disabled} aria-label={actionAriaLabel} onPointerDown={(event) => beginPress(event, setActionPressed, actionRipple.spawn)} onPointerUp={() => setActionPressed(false)} onPointerCancel={() => setActionPressed(false)} onLostPointerCapture={() => setActionPressed(false)} onClick={onAction}>
      <RippleLayer ripples={actionRipple.ripples} /><span className={styles.split__state} aria-hidden="true" />
      {icon && <span className={styles.split__icon}>{icon}</span>}{label && <span className={styles.split__label}>{label}</span>}
    </button>
    <button ref={dropdownRef} type="button" className={[styles.split__dropdown, isExpanded && styles["split__dropdown--selected"], dropdownPressed && styles["split__dropdown--pressed"]].filter(Boolean).join(" ")} disabled={disabled} aria-label={dropdownAriaLabel} aria-haspopup={hasMenu ? "menu" : undefined} aria-expanded={hasMenu ? isExpanded : undefined} aria-controls={hasMenu ? resolvedMenuId : undefined} onPointerDown={(event) => beginPress(event, setDropdownPressed, dropdownRipple.spawn)} onPointerUp={() => setDropdownPressed(false)} onPointerCancel={() => setDropdownPressed(false)} onLostPointerCapture={() => setDropdownPressed(false)} onClick={toggleDropdown}>
      <RippleLayer ripples={dropdownRipple.ripples} /><span className={styles.split__state} aria-hidden="true" /><span className={styles.split__chevron}>{isExpanded ? <ChevronUp /> : <ChevronDown />}</span>
    </button>
    {hasMenu && <div id={resolvedMenuId} role="menu" aria-label={menuAriaLabel} aria-hidden={!isExpanded} className={[styles.split__menu, isExpanded && styles["split__menu--open"]].filter(Boolean).join(" ")} onKeyDown={handleMenuKeyDown}>
      {menuItems.map((item, index) => <button ref={(node) => { itemRefs.current[index] = node; }} key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled} className={[styles.split__menuItem, item.destructive && styles["split__menuItem--destructive"]].filter(Boolean).join(" ")} style={{ "--item-index": index } as React.CSSProperties} onClick={() => { item.onSelect?.(); setExpanded(false); dropdownRef.current?.focus(); }}>
        {item.icon && <span className={styles.split__menuIcon}>{item.icon}</span>}<span className={styles.split__menuLabel}>{item.label}</span>{item.trailingText && <span className={styles.split__menuTrailing}>{item.trailingText}</span>}
      </button>)}
    </div>}
  </div>;
});
