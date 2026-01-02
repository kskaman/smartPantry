import type { DividerProps } from "../../types";

const Divider = ({
  orientation = "horizontal",
  className = "",
}: DividerProps) => (
  <hr
    role="separator"
    className={`
      border-none 
      bg-(--divider-color)
      ${orientation === "horizontal" ? "w-full h-[1.5px]" : "h-full w-[1.5px]"}
      ${className}
    `}
  />
);

export default Divider;
