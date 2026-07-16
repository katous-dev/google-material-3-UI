import styles from "./LoadingIndicator.module.scss";

export function LoadingIndicator() {
  return <span className={styles.loader} role="progressbar" aria-label="Loading"><i /></span>;
}
