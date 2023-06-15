import { deleteVoucher, getVouchers } from "api-client";
import RecordList from "@/components/RecordList";
import { Voucher, User, Campaign } from "database";
import { Outlet } from "react-router-dom";
const Vouchers = () => {
  return (
    <>
      <RecordList<Voucher>
        name="voucher"
        getFn={getVouchers}
        deleteFn={deleteVoucher}
        columns={[
          {
            title: "Coupon Code",
            dataIndex: "couponCode",
          },
          {
            title: "User",
            dataIndex: "user",
            render: (user: User) => user.fullName,
          },
          {
            title: "Campaign",
            dataIndex: "campaign",
            render: (campaign: Campaign) => campaign.name,
          },
          // {
          //   title: "Phone",
          //   dataIndex: "phone",
          // },
          // {
          //   title: "Number of vouchers",
          //   dataIndex: "vouchers",
          //   width: "25%",
          //   render: (vouchers: Voucher[]) => {
          //     return vouchers ? vouchers.length : 0;
          //   },
          // },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Vouchers;
