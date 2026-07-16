"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./ThemeToggle.module.scss";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("m3-theme", nextTheme);
    setTheme(nextTheme);
  };

  return <button type="button" className={styles.toggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} aria-pressed={theme === "dark"} onClick={toggleTheme}><span><Icon name={theme === "light" ? "sparkle" : "palette"} /></span><small>{theme === "light" ? "Light" : "Dark"}</small></button>;
}
