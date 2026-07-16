"use client";

import { useState } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./FabMenu.module.scss";

const actions: { label: string; icon: IconName }[] = [{ label: "Edit", icon: "edit" }, { label: "Share", icon: "share" }, { label: "Delete", icon: "trash" }];

export function FabMenu() {
  const [open, setOpen] = useState(false);
  return <div className={`${styles.wrap} ${open ? styles.open : ""}`}><div className={styles.actions}>{actions.map((action, index) => <button key={action.label} style={{ "--delay": index } as React.CSSProperties}><Icon name={action.icon} /><span>{action.label}</span></button>)}</div><button className={styles.fab} aria-label={open ? "Close actions" : "Open actions"} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "plus"} /></button></div>;
}
