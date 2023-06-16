import { useQuery } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { getStores } from "api-client";
import Link from "@/components/Link";
const Stores = () => {
  const storeList = useQuery({
    queryKey: ["store", "list"],
    queryFn: () => getStores({ take: 6 }),
  });
  return (
    <div className="p-4 bg-white rounded-xl">
      <SectionTitle title="Stores" moreLink="/stores" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {!storeList.isLoading &&
          storeList.data &&
          storeList.data.map((store) => {
            return (
              <Link
                to={`/store/${store.id}`}
                key={store.id + "record"}
                className="flex flex-col mt-3"
              >
                <div className="font-medium leading-normal text-md">
                  {store.name}
                </div>
                <div className="mt-2 text-sm text-gray-600 truncate">
                  {store.address &&
                    store.address.split(",").slice(0, -2).join(", ")}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Stores;
