import { forwardRef } from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";
const Link = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to"> & { to?: string; noStyle?: boolean }
>(({ className, noStyle, to, ...rest }, ref) => {
  const cn = twMerge(
    noStyle
      ? ""
      : "no-underline text-inherit hover:bg-gray-400/20 rounded-md p-1.5 -m-1.5",
    className
  );
  return to ? (
    <RouterLink to={to} ref={ref} className={cn} {...rest} />
  ) : (
    <a ref={ref} className={cn} {...rest} />
  );
});

export default Link;
