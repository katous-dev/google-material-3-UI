"use client";

import { PointerEvent, type CSSProperties, useRef, useState } from "react";
import styles from "./Carousel.module.scss";

export type CarouselLayout = "uniform" | "non-uniform";
export type CarouselContext = "mobile" | "tablet";

export interface CarouselItem {
  id: string;
  title: string;
  image?: string;
  accent?: string;
}

export interface CarouselProps {
  items?: CarouselItem[];
  layout?: CarouselLayout;
  context?: CarouselContext;
  showText?: boolean;
  visibleItems?: number;
  minItemWidth?: number;
  className?: string;
}

const defaultItems: CarouselItem[] = [
  { id: "item-1", title: "Expressive color", accent: "linear-gradient(135deg, #f6d6e8, #d8c8f1)" },
  { id: "item-2", title: "Purposeful motion", accent: "linear-gradient(135deg, #d4e9f6, #c8d0f2)" },
  { id: "item-3", title: "Adaptive shape", accent: "linear-gradient(135deg, #f4e3c1, #e9c9b8)" },
  { id: "item-4", title: "Clear hierarchy", accent: "linear-gradient(135deg, #d5ead9, #bfe0d3)" },
  { id: "item-5", title: "Material depth", accent: "linear-gradient(135deg, #e4d7f3, #c8c9ed)" },
  { id: "item-6", title: "Responsive rhythm", accent: "linear-gradient(135deg, #f2d7c5, #e9bfc8)" },
  { id: "item-7", title: "Focused detail", accent: "linear-gradient(135deg, #cde8e5, #b8d8ed)" },
  { id: "item-8", title: "Playful contrast", accent: "linear-gradient(135deg, #f1dfb7, #e6b9d1)" },
  { id: "item-9", title: "Natural motion", accent: "linear-gradient(135deg, #d7e7c5, #b9d9cb)" },
  { id: "item-10", title: "Human scale", accent: "linear-gradient(135deg, #e9d1c2, #cfc0e8)" },
];

export function Carousel({
  items: providedItems,
  layout = "non-uniform",
  context = "tablet",
  showText = false,
  visibleItems = 3,
  minItemWidth = 56,
  className,
}: CarouselProps) {
  const items = providedItems?.length ? providedItems : defaultItems;
  const [startIndex, setStartIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const draggingRef = useRef(false);

  const count = Math.max(1, Math.min(items.length, Math.round(visibleItems)));
  const maxStart = Math.max(0, items.length - count);
  const previewCount = dragging && dragOffset < 0 ? count + 1 : count;
  const visible = items.slice(startIndex, startIndex + previewCount);
  const dragProgress = Math.min(1, Math.abs(dragOffset) / 180);

  const weightFor = (index: number) => {
    if (layout === "uniform") return 1;
    if (index === 0) return 2.4 * (dragOffset < 0 ? 1 - dragProgress : 1);
    if (index === 1) return 1.7;
    return 0.9;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = event.clientX;
    dragOffsetRef.current = 0;
    draggingRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const offset = event.clientX - dragStartRef.current;
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const threshold = 50;
    const offset = dragOffsetRef.current;
    const direction = offset < -threshold ? 1 : offset > threshold ? -1 : 0;
    setStartIndex((current) => Math.max(0, Math.min(maxStart, current + direction)));
    dragOffsetRef.current = 0;
    draggingRef.current = false;
    setDragOffset(0);
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className={[
        styles.carousel,
        styles[`carousel--${layout}`],
        styles[`carousel--${context}`],
        showText && styles["carousel--with-text"],
        dragging && styles.carouselDragging,
        className,
      ].filter(Boolean).join(" ")}
      role="region"
      aria-label="Carousel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div
        className={styles.track}
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: dragging ? "none" : undefined,
          "--carousel-min-item-width": `${minItemWidth}px`,
        } as CSSProperties}
      >
        {visible.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={styles.item}
            style={{ flex: `${weightFor(index)} 1 0` }}
            aria-label={item.title}
            onClick={(event) => event.stopPropagation()}
          >
            <span
              className={styles.placeholder}
              style={item.image
                ? { backgroundImage: `url(${item.image})` }
                : item.accent
                  ? { background: item.accent }
                  : undefined}
              aria-hidden="true"
            />
            {showText && <span className={styles.text}>{item.title}</span>}
            <span className={styles.index} aria-hidden="true">0{startIndex + index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
