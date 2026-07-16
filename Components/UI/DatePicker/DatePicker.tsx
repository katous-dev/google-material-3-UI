"use client";

import { useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./DatePicker.module.scss";

const days = Array.from({ length: 35 }, (_, index) => index < 3 ? null : index - 2);
export function DatePicker() {
  const [selected, setSelected] = useState(16);
  return <div className={styles.picker}><header><small>Select date</small><strong>Thu, Jul {selected}</strong><Icon name="calendar" /></header><div className={styles.month}><button aria-label="Previous month">‹</button><b>July 2026</b><button aria-label="Next month">›</button></div><div className={styles.grid}>{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <small key={`${day}-${i}`}>{day}</small>)}{days.map((day, index) => day && day <= 31 ? <button key={day} className={selected === day ? styles.selected : ""} onClick={() => setSelected(day)}>{day}</button> : <span key={`empty-${index}`} />)}</div><footer><button>Cancel</button><button>OK</button></footer></div>;
}
