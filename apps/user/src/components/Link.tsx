import { forwardRef } from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";
const Link = forwardRef<HTMLAnchorElement, LinkProps & { noStyle?: boolean }>(
  ({ className, noStyle, ...rest }, ref) => {
    return (
      <RouterLink
        ref={ref}
        className={twMerge(
          noStyle
            ? ""
            : "no-underline text-inherit hover:bg-gray-400/20 rounded-md p-1.5 -m-1.5",
          className
        )}
        {...rest}
      />
    );
  }
);

export default Link;
