import { twMerge } from "tailwind-merge";

const SystemLogo = ({
  className,
  subName,
  ...rest
}: React.ComponentPropsWithoutRef<"div"> & { subName?: React.ReactNode }) => {
  return (
    <div
      className={twMerge(
        "inline-flex items-center gap-2 px-6 py-4 m-0 text-xl font-semibold text-white",
        className
      )}
      {...rest}
    >
      <span>eVoucher</span>
      {subName && (
        <span className="text-sm font-medium text-blue-300">{subName}</span>
      )}
    </div>
  );
};
export default SystemLogo;
