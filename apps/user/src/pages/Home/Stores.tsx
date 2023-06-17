import { useQuery } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { getStores } from "api-client";
import Link from "@/components/Link";
import useAppStore from "@/stores/useAppStore";
import ThumbnailImage from "@/components/ThumbnailImage";
import StoreAddress from "@/components/StoreAddress";
const Stores = () => {
  const appState = useAppStore();
  const nearBy = appState.userCoords
    ? appState.userCoords.join(",")
    : undefined;
  const storeList = useQuery({
    queryKey: ["store", "list", nearBy],
    queryFn: () =>
      getStores({
        take: 9,
        nearBy,
      }),
  });
  return (
    <div className="p-4 bg-white rounded-xl">
      <SectionTitle title="Recommended stores" moreLink="/stores" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {!storeList.isLoading &&
          storeList.data &&
          storeList.data.map((store) => {
            return (
              <Link
                to={`/store/${store.id}`}
                key={store.id + "record"}
                className="flex items-center w-full gap-3 mt-3"
              >
                <ThumbnailImage
                  src={store.merchant.image}
                  alt={store.name}
                  className="w-8 aspect-square grow-0 shrink-0"
                />
                <div className="flex flex-col w-full min-w-0 grow shrink">
                  <div className="font-medium leading-normal truncate text-md">
                    {store.name}
                  </div>
                  <StoreAddress className="w-full mt-1" store={store} />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Stores;
