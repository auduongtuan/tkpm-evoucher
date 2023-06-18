import { useQuery } from "@tanstack/react-query";
import { Select, Switch, message, Badge, Divider } from "antd";
import { getStores, getCategories } from "api-client";
import { DetailStore } from "database";
import pluralize from "pluralize-esm";
import { useEffect, useState } from "react";
import { Link } from "ui";
import SectionTitle from "@/components/SectionTitle";
import useAppStore from "@/stores/useAppStore";
import { StoresParamsType } from "database";
import ThumbnailImage from "ui/components/ThumbnailImage";
import StoreAddress from "@/components/StoreAddress";
import { useNavigate, useParams } from "react-router-dom";
const StoreCard = ({ store }: { store: DetailStore }) => {
  return (
    <Link
      to={`/store/${store.id}`}
      className="flex flex-col mt-3"
      // target="_blank"
    >
      <ThumbnailImage
        src={store.merchant.image}
        alt={store.name}
        className="mb-4"
      />

      <div className="font-medium leading-normal text-md">{store.name}</div>
      <StoreAddress className="mt-1" store={store} />

      <div className="mt-1 text-sm text-gray-500">
        {store.categories
          .map((category) => category.name)

          .join(", ")}
      </div>
    </Link>
  );
};
const StoreList = () => {
  // const queryFns = {
  //   merchant: getMerchants,
  //   store: getStores,
  //   category: getCategories,
  //   game: getGames,
  //   campaign: getCampaigns,
  //   user: getUsers,
  //   voucher: getVouchers,
  // };
  // const statistics: {[key: keyof typeof queryFns]: } = Object.keys(queryFns).reduce((acc, recordType) => {
  //   acc[recordType] = useQuery({
  //     queryKey: [recordType, "list"],
  //     queryFn: queryFns[recordType],
  //   });
  //   return acc;
  // }, {});
  const appState = useAppStore();
  const nearBy = appState.userCoords
    ? appState.userCoords.join(",")
    : undefined;
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  console.log(categoryId);
  const [options, setOptions] = useState<StoresParamsType>({});
  useEffect(() => {
    setOptions((options) => ({
      ...options,
      nearBy: nearBy,
      categoryId: Number(categoryId),
    }));
  }, [nearBy, categoryId]);

  const storeList = useQuery({
    queryKey: ["store", "list", options],
    queryFn: () =>
      getStores({
        ...options,
      }),
  });

  const categoryListQuery = useQuery({
    queryKey: ["category", "list"],
    queryFn: () => getCategories(),
  });

  const userCoords = useAppStore((state) => state.userCoords);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title="Store List" />
        <div className="flex items-center justify-between gap-6 mt-2">
          <div className="inline-flex items-center gap-2">
            <label htmlFor="select_category_id" className="text-sm">
              Category:
            </label>
            <Select
              id="select_category_id"
              placeholder="Select category"
              value={Number(categoryId) || undefined}
              options={[
                {
                  value: -1,
                  label: "All",
                },
              ].concat(
                !categoryListQuery.isLoading && categoryListQuery.data
                  ? categoryListQuery.data.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))
                  : []
              )}
              onSelect={(value) => {
                // setOptions((options) => ({
                //   ...options,
                //   categoryId: value,
                // }));
                if (value > 0) {
                  navigate(`/stores/category/${value}`);
                } else {
                  navigate("/stores");
                }
              }}
            ></Select>
          </div>
          <div className="inline-flex items-center gap-2">
            <label htmlFor="show_nearby" className="text-sm">
              Show nearby first
            </label>
            <Switch
              id="show_nearby"
              checked={options?.nearBy !== undefined}
              onChange={(checked) => {
                if (nearBy) {
                  setOptions((options) => ({
                    ...options,
                    nearBy: checked ? nearBy : undefined,
                  }));
                } else {
                  message.warning("Please allow location access first");
                }
              }}
            />
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {!storeList.isLoading &&
            storeList.data &&
            storeList.data.map((store) => {
              return store.campaigns.length ? (
                <Badge.Ribbon
                  text={
                    store.campaigns.length +
                    " " +
                    pluralize("campaign", store.campaigns.length)
                  }
                  key={store.id + "record"}
                >
                  <StoreCard store={store} />
                </Badge.Ribbon>
              ) : (
                <StoreCard key={store.id + "record"} store={store} />
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default StoreList;
