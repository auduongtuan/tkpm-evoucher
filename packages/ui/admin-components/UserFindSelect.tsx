// auto import
import { Select, SelectProps } from "antd";
import { findUser } from "api-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { debounce } from "lodash-es";

const UserFindSelect = ({ options, ...rest }: SelectProps) => {
  const [searchKey, setSearchKey] = useState<string>("");
  const searchCallback = useMemo(
    () => debounce((value: string) => setSearchKey(value), 300),
    []
  );
  const recordListQuery = useQuery({
    queryKey: ["user_find", searchKey],
    queryFn: async () =>
      await findUser({
        email: searchKey,
        phone: searchKey,
      }),
  });
  console.log(recordListQuery.data);
  return (
    <Select
      showSearch
      placeholder={`Enter phone or email to search`}
      // optionFilterProp="children"
      // filterOption={(input, option) =>
      //   ((option?.label ?? "") as string)
      //     .toLowerCase()
      //     .includes(input.toLowerCase())
      // }
      filterOption={false}
      onSearch={(value) => {
        searchCallback(value);
      }}
      options={(options || []).concat(
        !recordListQuery.isLoading && recordListQuery.data
          ? [recordListQuery.data].map((record) => ({
              value: record.id,
              label: record.fullName,
            }))
          : []
      )}
      {...rest}
    />
  );
};
export default UserFindSelect;
