import { useQuery } from "@tanstack/react-query";
import { Select, Switch, message, Badge, Divider, Empty } from "antd";
import { getStores, getCategories, getMerchants } from "api-client";
import { DetailStore } from "database";
import pluralize from "pluralize-esm";
import { useEffect, useState } from "react";
import { Link } from "ui";
import SectionTitle from "@/components/SectionTitle";
import useAppStore from "@/stores/useAppStore";
import { StoresParamsType } from "database";
import ThumbnailImage from "ui/components/ThumbnailImage";
import StoreAddress from "@/components/StoreAddress";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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

  let [searchParams, setSearchParams] = useSearchParams();

  const storeList = useQuery({
    queryKey: ["store", "list", searchParams.toString()],
    queryFn: () => {
      const merchantId = Number(searchParams.get("merchantId"));
      const categoryId = Number(searchParams.get("categoryId"));
      return getStores({
        merchantId: merchantId > -1 ? merchantId : undefined,
        categoryId: categoryId > -1 ? categoryId : undefined,
        nearBy:
          searchParams.get("nearBy") == "true" && userCoords
            ? userCoords.join(",")
            : undefined,
      });
    },
  });

  const categoryListQuery = useQuery({
    queryKey: ["category", "list"],
    queryFn: () => getCategories(),
  });

  const merchantListQuery = useQuery({
    queryKey: ["merchant", "list"],
    queryFn: () => getMerchants(),
  });

  const userCoords = useAppStore((state) => state.userCoords);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title="Store List" />
        <div className="flex items-center gap-6 mt-2">
          <div className="inline-flex items-center gap-2">
            <label htmlFor="select_category_id" className="text-sm">
              Category:
            </label>
            <Select
              id="select_category_id"
              placeholder="Select category"
              value={Number(searchParams.get("categoryId")) || undefined}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              className="w-40"
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
                setSearchParams((searchParams) => {
                  if (value < 0) {
                    searchParams.delete("categoryId");
                  } else {
                    searchParams.set("categoryId", value.toString());
                  }
                  return searchParams;
                });
              }}
            ></Select>
          </div>
          <div className="inline-flex items-center gap-2">
            <label htmlFor="select_merchant_id" className="text-sm">
              Merchant:
            </label>
            <Select
              id="select_merchant_id"
              placeholder="Select merchant"
              className="w-40"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              value={Number(searchParams.get("merchantId")) || undefined}
              options={[
                {
                  value: -1,
                  label: "All",
                },
              ].concat(
                !merchantListQuery.isLoading && merchantListQuery.data
                  ? merchantListQuery.data.map((merchant) => ({
                      value: merchant.id,
                      label: merchant.name,
                    }))
                  : []
              )}
              onSelect={(value) => {
                // setOptions((options) => ({
                //   ...options,
                //   categoryId: value,
                // }));
                setSearchParams((searchParams) => {
                  if (value < 0) {
                    searchParams.delete("merchantId");
                  } else {
                    searchParams.set("merchantId", value.toString());
                  }
                  return searchParams;
                });
              }}
            ></Select>
          </div>
          <div className="flex justify-end grow">
            <div className="inline-flex items-center gap-2">
              <label htmlFor="show_nearby" className="text-sm">
                Show nearby first
              </label>
              <Switch
                id="show_nearby"
                checked={searchParams.get("nearBy") === "true"}
                onChange={(checked) => {
                  if (nearBy) {
                    setSearchParams((searchParams) => {
                      searchParams.set("nearBy", checked.toString());
                      return searchParams;
                    });
                  } else {
                    message.warning("Please allow location access first");
                  }
                }}
              />
            </div>
          </div>
        </div>
        <Divider />

        {!storeList.isLoading &&
          storeList.data &&
          (storeList.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {storeList.data.map((store) => {
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
          ) : (
            <Empty description="No stores found" />
          ))}
      </div>
    </div>
  );
};
export default StoreList;
