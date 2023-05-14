// auto import
import { Select, SelectProps } from "antd";
import { getCampaigns, getMerchants, getUsers, getStores } from "@/api-client";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Merchant, User, Store } from "database";
const RecordSelectHOC = <T extends { id: number }>(
  name: string,
  getFn: () => Promise<Array<(T & { [key: string]: any }) | T>>,
  labelProp: string = "name"
) => {
  const RecordSelect = (rest: SelectProps) => {
    const recordListQuery = useQuery({
      queryKey: [name, "list"],
      queryFn: getFn,
    });
    return (
      <Select
        showSearch
        placeholder={`Select a ${name}`}
        optionFilterProp="children"
        filterOption={(input, option) =>
          ((option?.label ?? "") as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={
          !recordListQuery.isLoading && recordListQuery.data
            ? recordListQuery.data.map((record: T) => ({
                value: record.id,
                label: record[labelProp],
              }))
            : []
        }
        {...rest}
      />
    );
  };
  return RecordSelect;
};
export const CampaignSelect = RecordSelectHOC<Campaign>(
  "campaign",
  getCampaigns
);
export const MerchantSelect = RecordSelectHOC<Merchant>(
  "merchant",
  getMerchants
);
export const UserSelect = RecordSelectHOC<User>("user", getUsers, "fullName");
export const StoreSelect = RecordSelectHOC<Store>("store", getStores);
