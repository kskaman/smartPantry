"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  /** If true, selection is required (adds aria-required to the listbox) */
  required?: boolean;
  /** Optional placeholder option to show as the first dropdown item */
  placeholderOption?: SelectOption | null;
  /** Whether the placeholder option (if provided) is selectable */
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

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value) || null;
  // build the list of options to render; include placeholderOption first if provided

  function handleSelect(val: string) {
    if (disabled) return;
    if (controlledValue === undefined) {
      setUncontrolledValue(val);
    }
    onChange?.(val);
    setOpen(false);
  }

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
      ? "px-4 py-3 text-base"
      : "px-3 py-2 text-sm";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className || ""}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={`select-component flex items-center justify-between w-full ${sizeClasses}`}
      >
        <span
          className={`truncate ${
            value ? "text-body-medium" : "text-caption text-muted-foreground"
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

      {open && (
        <ul
          role="listbox"
          aria-required={required}
          ref={listRef}
          className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-auto"
        >
          {options.map((opt, idx) => {
            const isPlaceholder = placeholderOption && idx === 0;
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
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {renderOption ? (
                  renderOption(opt, isSelected)
                ) : (
                  <span className="truncate">{opt.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
