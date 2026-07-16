import { IconButton } from "../ActionButtons/ActionButtons";
import styles from "./Toolbar.module.scss";

export function Toolbar() { return <div className={styles.toolbar}><IconButton icon="edit" label="Edit" /><IconButton icon="image" label="Add image" /><IconButton icon="share" label="Share" /></div>; }
