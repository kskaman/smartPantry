import clsx from "clsx";
import type { TextInputProps } from "../../types";

const TextInput = ({
  type = "text",
  onChange,
  label,
  subLabel,
  name,
  value,
  placeholder = "",
  startIcon,
  endIcon,
  disabled = false,
  onFocus,
}: TextInputProps) => {
  return (
    <div className="w-full flex flex-col gap-[1px]">
      <div className="mb-[2px] flex justify-between items-center">
        {label && (
          <span className="text-small text-(--input-field-label-color)">
            {label}
          </span>
        )}
        {subLabel && (
          <span className="text-caption text-(--input-field-subLabel-color)">
            {subLabel}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "flex items-center rounded-[8px] h-[40px]",
          disabled ? "bg-(--input-field-disabled-bg)" : "bg-(--input-field-bg)",
          "border border-(--input-field-border)"
        )}
      >
        {startIcon && <span className="ml-3 mr-2">{startIcon}</span>}

        <input
          type={type}
          name={name}
          value={value}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          autoComplete="off"
          className="
            flex-1 
            bg-transparent 
            outline-none 
            h-full 
            px-[8px] 
            text-body
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none"
        />

        {endIcon && (
          <span
            className={clsx(
              "mr-4 ml-2 flex align-center",
              disabled && "cursor-not-allowed"
            )}
          >
            <button type="button" disabled={disabled}>
              {endIcon}
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInput;
