import type { ReactNode } from "react";
import styles from "./Tooltip.module.scss";

export function Tooltip({ content, rich = false, children }: { content: ReactNode; rich?: boolean; children: ReactNode }) {
  return <span className={styles.anchor}>{children}<span role="tooltip" className={`${styles.tooltip} ${rich ? styles.rich : ""}`}>{rich && <strong>Helpful context</strong>}<span>{content}</span>{rich && <button>Learn more</button>}</span></span>;
}
