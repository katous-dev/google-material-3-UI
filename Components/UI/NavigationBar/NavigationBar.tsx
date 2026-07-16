import { Icon, type IconName } from "../Icon/Icon";
import styles from "./NavigationBar.module.scss";

const items: { label: string; icon: IconName }[] = [{ label: "Home", icon: "home" }, { label: "Explore", icon: "search" }, { label: "Theme", icon: "palette" }, { label: "Settings", icon: "settings" }];

export function NavigationBar({ active, onChange }: { active: number; onChange: (index: number) => void }) {
  return <nav className={styles.nav}>{items.map((item, index) => <button key={item.label} className={active === index ? styles.active : ""} onClick={() => onChange(index)}><span><Icon name={item.icon} width={21} /></span><small>{item.label}</small></button>)}</nav>;
}
