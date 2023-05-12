// auto import
import { Select, SelectProps } from "antd";
import { getMerchants } from "@/api-client";
import { useQuery } from "@tanstack/react-query";
import { forwardRef } from "react";
const MerchantSelect = ({ ...rest }: SelectProps) => {
  const merchantListQuery = useQuery({
    queryKey: ["merchant", "list"],
    queryFn: getMerchants,
  });
  return (
    <Select
      showSearch
      placeholder="Select a merchant"
      optionFilterProp="children"
      filterOption={(input, option) =>
        ((option?.label ?? "") as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      options={
        !merchantListQuery.isLoading && merchantListQuery.data
          ? merchantListQuery.data.map((merchant) => ({
              value: merchant.id,
              label: merchant.name,
            }))
          : []
      }
      {...rest}
    />
  );
};
export default MerchantSelect;
