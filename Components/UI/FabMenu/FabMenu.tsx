"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./FabMenu.module.scss";

// ─── Ripple hook (giống Button) ────────────────────────────────
interface Ripple { id: number; x: number; y: number; size: number; }

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);

  const spawn = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const id = counter.current++;
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size },
    ]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  // Cleanup: xóa tất cả ripple (dùng khi đóng menu / unmount)
  const clear = useCallback(() => {
    setRipples([]);
    counter.current = 0;
  }, []);

  return { ripples, spawn, clear };
}

// ─── Types ────────────────────────────────────────────────────

export type FabDirection = "up" | "down" | "left" | "right";
export type FabPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export type FabMenuAlign = "left" | "right" | "center";

export interface FabAction {
  /** Unique identifier */
  id: string;
  /** Label hiển thị bên cạnh icon */
  label: string;
  /** Icon từ Icon system */
  icon: IconName;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Destructive — dùng để style khác (vd: màu đỏ) */
  destructive?: boolean;
}

export interface FabMenuProps {
  /**
   * Danh sách action buttons.
   * Bắt buộc — không còn hard-code Edit/Share/Delete như trước.
   */
  actions: FabAction[];

  /**
   * Direction mà menu expand ra.
   * @default "up"
   */
  direction?: FabDirection;

  /**
   * Placement của FAB trong wrap (chỉ ảnh hưởng layout flex).
   * @default "bottom-right"
   */
  placement?: FabPlacement;

  /**
   * Căn chỉnh menu items theo chiều ngang của wrap.
   * - "right" (mặc định): menu items dồn sang phải, FAB ở góc phải.
   * - "left": menu items dồn sang trái, FAB ở góc trái.
   * - "center": menu items ở giữa, FAB ở giữa.
   * @default "right"
   */
  menuAlign?: FabMenuAlign;

  /**
   * Icon hiển thị trên FAB khi đóng.
   * @default "plus"
   */
  fabIcon?: IconName;

  /**
   * Icon hiển thị trên FAB khi mở.
   * @default "close"
   */
  closeIcon?: IconName;

  /**
   * Aria-label cho FAB button.
   * @default mặc định theo open state
   */
  ariaLabel?: string;

  /**
   * Controlled mode — giá trị open.
   * Nếu truyền, component sẽ là controlled và bỏ qua internal state.
   */
  open?: boolean;

  /**
   * Callback khi open state thay đổi.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Uncontrolled mode — giá trị open ban đầu.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Đóng menu khi click ra ngoài.
   * @default true
   */
  closeOnOutsideClick?: boolean;

  /**
   * Đóng menu khi click vào 1 action.
   * @default true
   */
  closeOnActionClick?: boolean;

  /**
   * ClassName bổ sung cho wrap container.
   */
  className?: string;

  /**
   * ClassName bổ sung cho FAB button.
   */
  fabClassName?: string;

  /**
   * ClassName bổ sung cho action buttons.
   */
  actionClassName?: string;
}

// ─── Component ────────────────────────────────────────────────

export const FabMenu = forwardRef<HTMLDivElement, FabMenuProps>(function FabMenu(
  {
    actions,
    direction = "up",
    placement = "bottom-right",
    menuAlign = "right",
    fabIcon = "plus",
    closeIcon = "close",
    ariaLabel,
    open: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    closeOnOutsideClick = true,
    closeOnActionClick = true,
    className,
    fabClassName,
    actionClassName,
  },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const wrapRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // CallbackRef: vừa giữ wrapRef nội bộ, vừa forward ra ngoài
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      wrapRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref]
  );

  // Stable callback ref để tránh re-attach effect
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChangeRef.current?.(next);
    },
    [isControlled]
  );

  // ── Close on outside click ────────────────────────────────
  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;
    const handler = (event: PointerEvent) => {
      const target = event.target as Node;
      // Bỏ qua nếu click vào FAB (FAB có handler riêng để toggle)
      if (fabRef.current?.contains(target)) return;
      // Bỏ qua nếu click trong wrap (action buttons)
      if (wrapRef.current?.contains(target)) return;
      // Click hoàn toàn bên ngoài → đóng
      setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, closeOnOutsideClick, setOpen]);

  // ── Close on Escape ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  const handleActionClick = (action: FabAction) => {
    action.onClick?.();
    if (closeOnActionClick) {
      // Blur để clear :active / :focus ngay lập tức
      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Render flag sẽ tự unmount sau 320ms — không cần setTimeout ở đây
      setOpen(false);
    }
  };

  const handleFabClick = () => {
    setOpen(!open);
  };

  // ── Ripples — MỖI action có state riêng để ripple không lan sang button khác ──
  // Bug cũ: 1 useRipple() shared → khi pointerdown button A, ripple spawn vào state chung
  // → cả 3 button cùng render cùng `<span className={styles.ripple}>` → animation chạy cả 3.
  const [actionRipplesMap, setActionRipplesMap] = useState<Record<string, Ripple[]>>({});
  const rippleCounters = useRef<Record<string, number>>({});

  const spawnActionRipple = useCallback((actionId: string, event: React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const id = (rippleCounters.current[actionId] ?? 0) + 1;
    rippleCounters.current[actionId] = id;
    setActionRipplesMap((prev) => ({
      ...prev,
      [actionId]: [
        ...(prev[actionId] ?? []),
        { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size },
      ],
    }));
    window.setTimeout(() => {
      setActionRipplesMap((prev) => ({
        ...prev,
        [actionId]: (prev[actionId] ?? []).filter((r) => r.id !== id),
      }));
    }, 600);
  }, []);

  // FAB ripple (chỉ 1 FAB)
  const fabRipple = useRipple();

  // ── Press flag: khi user đang nhấn 1 action, ngăn hover effect lan
  // sang các button khác (đặc biệt khi menu chuẩn bị unmount) ──────
  const [isPressing, setIsPressing] = useState(false);

  const currentIcon = open ? closeIcon : fabIcon;
  const computedAriaLabel = ariaLabel ?? (open ? "Close actions" : "Open actions");

  // ── Build className cho wrap ───────────────────────────────
  const wrapCx = [
    styles.wrap,
    open && styles.open,
    isPressing && styles.pressing,
    styles[`dir-${direction}`],
    styles[`place-${placement}`],
    styles[`align-${menuAlign}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Build className cho action buttons ────────────────────
  const actionCx = (action: FabAction) =>
    [
      actionClassName,
      action.disabled && styles.actionDisabled,
      action.destructive && styles.actionDestructive,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div ref={setRefs} className={wrapCx}>
      {/* Menu layer — absolute, expand theo anchor (FAB) */}
      <div className={styles.menu} role="menu" aria-hidden={!open}>
        {actions.map((action, index) => (
          <button
            key={action.id}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            disabled={action.disabled}
            aria-label={action.label}
            style={{ "--delay": index } as React.CSSProperties}
            className={[styles.action, actionCx(action)].filter(Boolean).join(" ")}
            onPointerDown={(event) => {
              // Ngăn document.mousedown bắt được → tránh auto-close menu
              event.stopPropagation();
              spawnActionRipple(action.id, event);
              setIsPressing(true);
            }}
            onPointerUp={() => setIsPressing(false)}
            onPointerLeave={() => setIsPressing(false)}
            onPointerCancel={() => setIsPressing(false)}
            onClick={() => handleActionClick(action)}
          >
            <span className={styles.ripples} aria-hidden="true">
              {(actionRipplesMap[action.id] ?? []).map(({ id, x, y, size }) => (
                <span
                  key={id}
                  className={styles.ripple}
                  style={{ left: x, top: y, width: size, height: size }}
                />
              ))}
            </span>
            <span className={styles.state} aria-hidden="true" />
            <Icon name={action.icon} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Anchor — FAB là element thực sự trong flow, không bao giờ di chuyển */}
      <button
        ref={fabRef}
        type="button"
        className={[styles.fab, fabClassName].filter(Boolean).join(" ")}
        aria-label={computedAriaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onPointerDown={(event) => {
          // Ngăn document.pointerdown handler trigger outside-click
          event.stopPropagation();
          fabRipple.spawn(event);
        }}
        onClick={handleFabClick}
      >
        <span className={styles.ripples} aria-hidden="true">
          {fabRipple.ripples.map(({ id, x, y, size }) => (
            <span
              key={id}
              className={styles.ripple}
              style={{ left: x, top: y, width: size, height: size }}
            />
          ))}
        </span>
        <span className={styles.state} aria-hidden="true" />
        <span className={styles.fabIcon} aria-hidden="true">
          <Icon name={currentIcon} />
        </span>
      </button>
    </div>
  );
});

FabMenu.displayName = "FabMenu";
