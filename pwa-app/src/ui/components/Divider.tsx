import type { DividerProps } from "../../types";

const Divider = ({
  orientation = "horizontal",
  className = "",
}: DividerProps) => (
  <hr
    role="separator"
    className={`
      border-none 
      bg-(--divider)
      ${orientation === "horizontal" ? "w-full h-[1px]" : "h-full w-[1.5px]"}
      ${className}
    `}
  />
);

export default Divider;
