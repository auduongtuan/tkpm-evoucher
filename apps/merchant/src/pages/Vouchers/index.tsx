import { deleteVoucher, getVouchers } from "api-client";
import RecordList from "ui/admin-components/RecordList";
import { Voucher, User, Campaign, VoucherWithStatus } from "database";
import { Outlet } from "react-router-dom";
import { VoucherStatus } from "ui";
import useEmployeeAuth from "ui/hooks/useEmployeeAuth";
const Vouchers = () => {
  const { authenticated, employee } = useEmployeeAuth(false);
  console.log(employee?.merchantId);
  return (
    <>
      <RecordList<Voucher>
        name="voucher"
        getFn={async () =>
          await getVouchers({
            merchantId:
              employee && employee.merchantId ? employee.merchantId : undefined,
          })
        }
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
          {
            title: "Discount Type",
            dataIndex: "discountType",
          },
          {
            title: "Discount Value",
            dataIndex: "discountValue",
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status: string, voucher: VoucherWithStatus) => (
              <VoucherStatus voucher={voucher} />
            ),
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
