import { Extended } from "helpers";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import useAppStore from "@/stores/useAppStore";
import { distance } from "helpers";
import { Store } from "database";
const StoreAddress = ({
  store,
  className,
  ...rest
}: { store: Extended<Store> } & ComponentPropsWithoutRef<"div">) => {
  const userCoords = useAppStore((state) => state.userCoords);
  return (
    <div
      className={twMerge("text-sm text-gray-700 truncate w-full", className)}
      {...rest}
    >
      {userCoords &&
        distance(userCoords[0], userCoords[1], store.lat, store.lng) + "KM - "}
      {store.address && store.address.split(",").slice(0, -2).join(", ")}
    </div>
  );
};
export default StoreAddress;
