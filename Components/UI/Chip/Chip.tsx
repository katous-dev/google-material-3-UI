import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Chip.module.scss";

export function Chip({ selected, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return <button className={`${styles.chip} ${selected ? styles.selected : ""}`} {...props}>{selected && <Icon name="check" width={16} />}{children}</button>;
}
