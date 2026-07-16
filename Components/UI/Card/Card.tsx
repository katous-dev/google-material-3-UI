import type { ReactNode } from "react";
import styles from "./Card.module.scss";

export function Card({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children: ReactNode; actions?: ReactNode }) {
  return <article className={styles.card}><div className={styles.art}><span /><span /><span /></div><div className={styles.body}>{eyebrow && <small>{eyebrow}</small>}<h3>{title}</h3><p>{children}</p>{actions && <div className={styles.actions}>{actions}</div>}</div></article>;
}
