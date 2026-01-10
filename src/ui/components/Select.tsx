"use client";

import { ChevronDown } from "lucide-react";
import React, {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  ariaLabel?: string;
  required?: boolean;
  placeholderOption?: SelectOption | null;
  placeholderSelectable?: boolean;
}

export default function Select({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  className,
  placeholder = "Select...",
  size = "md",
  disabled = false,
  renderOption,
  ariaLabel = "Select",
  required = false,
  placeholderOption = null,
  placeholderSelectable = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);

  const value = controlledValue ?? uncontrolledValue;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [portalStyle, setPortalStyle] = useState<CSSProperties | null>(null);

  // Measure and position the portal when opening
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;

    const update = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      const left = rect.left + window.scrollX;
      const width = rect.width;
      setPortalStyle({ position: "absolute", top, left, width });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open]);

  // Close on Escape and click outside (checks both container and portal list)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (listRef.current && listRef.current.contains(target)) return;
      setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onDoc);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  function handleSelect(val: string) {
    if (disabled) return;
    if (controlledValue === undefined) setUncontrolledValue(val);
    onChange?.(val);
    setOpen(false);
  }

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
      ? "px-4 py-3 text-base"
      : "px-3 py-2 text-sm";

  const selected = options.find((o) => o.value === value) || null;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className || ""}`}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={`select-component flex items-center justify-between w-full rounded-[8px] ${sizeClasses}`}
      >
        <span
          className={`truncate ${
            selected ? "text-body-medium" : "text-caption text-muted-foreground"
          }`}
        >
          {selected
            ? selected.label
            : placeholderOption
            ? placeholderOption.label
            : placeholder}
        </span>
        <ChevronDown />
      </button>

      {open && portalStyle
        ? createPortal(
            <ul
              role="listbox"
              aria-required={required}
              ref={listRef}
              style={portalStyle}
              className="z-50 rounded-[8px] mt-2 shadow-md max-h-60 
              overflow-auto border border-(--select-border) bg-(--select-bg)"
            >
              {options.map((opt, idx) => {
                const isPlaceholder = !!placeholderOption && idx === 0;
                const isSelected = value === opt.value;
                const handleClick = () => {
                  if (isPlaceholder && !placeholderSelectable) return;
                  handleSelect(opt.value);
                };
                return (
                  <li
                    key={opt.value + "-" + idx}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={
                      isPlaceholder && !placeholderSelectable ? true : undefined
                    }
                    onClick={handleClick}
                    className={`px-3 py-2 cursor-pointer bg-(--select-bg) border-(--select-border)`}
                  >
                    {renderOption ? (
                      renderOption(opt, isSelected)
                    ) : (
                      <span className="text-small">{opt.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}
