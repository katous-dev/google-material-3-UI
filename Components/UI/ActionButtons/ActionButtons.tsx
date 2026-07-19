"use client";

import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./ActionButtons.module.scss";

export function IconButton({ icon, selected = false, variant = "standard", label, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; selected?: boolean; variant?: "standard" | "filled" | "tonal" | "outlined"; label: string }) {
  return <button aria-label={label} aria-pressed={selected} title={label} className={`${styles.iconButton} ${styles[variant]} ${selected ? styles.selected : ""}`} {...props}><Icon name={icon} /></button>;
}

export function ToggleButton({ selected, onChange, children, icon = "favorite", variant = "tonal" }: { selected: boolean; onChange: (value: boolean) => void; children: React.ReactNode; icon?: IconName; variant?: "tonal" | "outlined" }) {
  return <button aria-pressed={selected} className={`${styles.toggle} ${styles[variant]} ${selected ? styles.selected : ""}`} onClick={() => onChange(!selected)}><Icon name={selected ? "check" : icon} width={20} />{children}</button>;
}
