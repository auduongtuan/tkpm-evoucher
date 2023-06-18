import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const ThumbnailImage = ({
  src,
  alt,
  className,
  ...rest
}: Omit<ComponentPropsWithoutRef<"img">, "src"> & { src: string | null }) => {
  return src ? (
    <img
      src={src}
      className={twMerge(
        "max-w-full object-cover rounded-md aspect-[4/3]",
        className
      )}
      alt={alt}
      {...rest}
    />
  ) : (
    <div
      className={twMerge(
        "object-cover bg-gray-200 rounded-md aspect-[4/3]",
        className
      )}
      {...rest}
    ></div>
  );
};
export default ThumbnailImage;
