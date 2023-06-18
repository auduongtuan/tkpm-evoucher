import { Link, Outlet } from "react-router-dom";
import { Typography, Button } from "antd";
import useRecord from "ui/hooks/useRecord";
import useAdminStore from "ui/hooks/useAdminStore";
import { FullMerchant, Merchant } from "database";
import { getFullMerchant } from "api-client";
import { Description } from "ui";
import ThumbnailImage from "ui/components/ThumbnailImage";
import dayjs from "dayjs";
import { quantityPluralize } from "helpers";
const MerchantView = () => {
  const employee = useAdminStore((state) => state.employee);
  const { recordQuery } = useRecord<FullMerchant>({
    name: "merchant",
    recordId: employee?.merchantId || undefined,
    getFn: getFullMerchant,
  });
  const merchant = recordQuery.data;
  return (
    <>
      <div className="flex mb-4">
        <Typography.Title level={2} className="flex-grow mb-0">
          Your Merchant
        </Typography.Title>
      </div>
      {merchant && (
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div className="col-span-3 md:col-span-1">
            {merchant.image ? (
              <ThumbnailImage src={merchant.image} alt={"Image"} />
            ) : (
              "No image"
            )}
          </div>
          <div className="col-span-3 md:col-span-2">
            <div className="grid grid-cols-2 gap-6 ">
              <Description label={"Name"}>
                <div>{merchant.name}</div>
              </Description>
              <Description label={"Date joined"}>
                <div>{dayjs(merchant.createdAt).format("DD/MM/YYYY")}</div>
              </Description>
              <Description label={"Description"}>
                <div>{merchant.description}</div>
              </Description>
              <Description label={"Total stores"}>
                <div>{quantityPluralize(merchant.stores.length, "store")}</div>
              </Description>
              <Link to={`/merchant/edit`}>
                <Button>Edit information</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};
export default MerchantView;
