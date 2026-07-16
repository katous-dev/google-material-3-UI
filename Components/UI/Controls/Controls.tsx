"use client";

import type { InputHTMLAttributes } from "react";
import styles from "./Controls.module.scss";

export function Switch({ checked, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <label className={styles.switch}><input type="checkbox" checked={checked} {...props} /><span><i /></span></label>;
}

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={styles.choice}><input type="checkbox" {...props} /><span className={styles.checkbox}>✓</span>{label}</label>;
}

export function Radio({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={styles.choice}><input type="radio" {...props} /><span className={styles.radio} />{label}</label>;
}
