import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./AdvancedChip.module.scss";

export function AdvancedChip({ chipType = "assistive", icon, children, onRemove, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { chipType?: "assistive" | "suggestion" | "input"; icon?: IconName; onRemove?: () => void }) {
  return <span className={`${styles.chip} ${styles[chipType]}`}><button {...props}>{icon && <Icon name={icon} width={18} />}{children}</button>{onRemove && <button className={styles.remove} aria-label="Remove" onClick={onRemove}><Icon name="close" width={17} /></button>}</span>;
}
