import SectionTitle from "@/components/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { getAuthUserWithVouchers } from "api-client";
import { Link, Description, VoucherStatus } from "ui";
import { Divider, Empty } from "antd";
import dayjs from "dayjs";
import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const UserVoucher = () => {
  const { authenticated } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, [authenticated]);
  const userWithVouchers = useQuery({
    queryKey: ["user_with_vouchers"],
    queryFn: async () => await getAuthUserWithVouchers(),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl">
        <SectionTitle title={"Your vouchers"} />
        <div className="flex flex-col gap-2 mt-4">
          {!userWithVouchers.isLoading &&
            userWithVouchers.data?.vouchers &&
            (userWithVouchers.data?.vouchers.length > 0 ? (
              userWithVouchers.data?.vouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col gap-1">
                  <p className="mt-1 mb-1 font-bold text-blue-600 text-1xl">
                    {voucher.couponCode}
                  </p>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Description label="Value" className="grow">
                      <div className="font-semibold">
                        {voucher.discountValue}
                        {voucher.discountType == "FIXED" ? " VND" : "%"}
                      </div>
                      <span className="mt-2 text-xs text-gray-500 uppercase">
                        Up to {voucher.maxDiscount}
                        {voucher.discountType == "FIXED" ? "% of bill" : " VND"}
                      </span>
                    </Description>
                    <Description label="Valid from" className="grow">
                      {dayjs(voucher.createdAt).format("DD/MM/YYYY")}
                    </Description>
                    <Description label="Valid until" className="grow">
                      {dayjs(voucher.expiredAt).format("DD/MM/YYYY")}
                    </Description>
                    <Description label="Status" className="grow">
                      <VoucherStatus voucher={voucher} />
                    </Description>
                    <Description label="Merchant" className="grow">
                      {voucher.campaign.merchant.name}
                    </Description>
                    <Description
                      label="Applied stores"
                      className="col-span-2 md:col-span-2"
                    >
                      <ul className="pl-2 mt-2 ml-0 list-disc list-inside">
                        {voucher.campaign.stores.map((store) => (
                          <li key={store.id} className="mt-2">
                            <Link to={`/store/${store.id}`}>{store.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </Description>
                  </div>

                  <p></p>
                </div>
              ))
            ) : (
              <Empty description="No vouchers" />
            ))}
        </div>
      </div>
    </div>
  );
};
export default UserVoucher;
