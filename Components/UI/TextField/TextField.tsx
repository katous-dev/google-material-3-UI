import type { InputHTMLAttributes } from "react";
import styles from "./TextField.module.scss";

export function TextField({ label, supporting, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; supporting?: string }) {
  return <label className={styles.wrap}><span className={styles.field}><input placeholder=" " {...props} /><i>{label}</i></span>{supporting && <small>{supporting}</small>}</label>;
}
