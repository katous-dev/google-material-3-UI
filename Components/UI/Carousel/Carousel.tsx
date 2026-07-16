"use client";

import { useState } from "react";
import styles from "./Carousel.module.scss";

const slides = [{ title: "Expressive color", color: "var(--support-green)" }, { title: "Purposeful motion", color: "var(--primary-container)" }, { title: "Adaptive shape", color: "var(--support-pink)" }, { title: "Clear hierarchy", color: "var(--support-yellow)" }];
export function Carousel() {
  const [active, setActive] = useState(0);
  return <div className={styles.wrap}><div className={styles.carousel}>{slides.map((slide, index) => <button key={slide.title} className={active === index ? styles.active : ""} style={{ background: slide.color }} onClick={() => setActive(index)}><span>0{index + 1}</span><strong>{slide.title}</strong></button>)}</div><div className={styles.dots}>{slides.map((slide, index) => <button key={slide.title} aria-label={`Show ${slide.title}`} className={active === index ? styles.dotActive : ""} onClick={() => setActive(index)} />)}</div></div>;
}
