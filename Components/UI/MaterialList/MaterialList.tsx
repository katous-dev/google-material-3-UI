import { Icon, type IconName } from "../Icon/Icon";
import styles from "./MaterialList.module.scss";

const items: { title: string; meta: string; icon: IconName }[] = [{ title: "Design foundations", meta: "Updated 2 minutes ago", icon: "palette" }, { title: "Component library", meta: "24 shared components", icon: "sparkle" }, { title: "Motion guidelines", meta: "Emphasized easing", icon: "arrow" }];
export function MaterialList() { return <div className={styles.list}>{items.map((item) => <button key={item.title}><span><Icon name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.meta}</small></span><Icon name="chevron" width={19} /></button>)}</div>; }
