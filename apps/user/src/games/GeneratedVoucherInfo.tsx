import { Divider } from "antd";
import dayjs from "dayjs";
import { Description } from "ui";
import { Button } from "antd";
import { DetailCampaign } from "database";
import useGameStore, { VoucherStringDate } from "../stores/useGameStore";

const GeneratedVoucherInfo = ({
  voucherInfo,
  campaign,
}: {
  voucherInfo: VoucherStringDate;
  campaign: DetailCampaign;
}) => {
  const gameState = useGameStore();
  return (
    <div>
      <p className="mb-2 text-center">You have won a voucher worth</p>
      <p className="mt-1 mb-1 text-3xl font-bold text-center text-blue-600">
        {voucherInfo.discountValue}
        {voucherInfo.discountType == "FIXED" ? " VND" : "%"}
        <br />
      </p>
      <p className="text-xs font-medium text-center text-gray-400 uppercase">
        Up to {voucherInfo.maxDiscount}
        {voucherInfo.discountType == "FIXED" ? "% of bill" : " VND"}
      </p>
      <Divider />
      <div className="flex gap-8 mt-2 mb-4 ">
        <Description label="Valid from" className="grow">
          {dayjs(voucherInfo.createdAt).format("DD/MM/YYYY")}
        </Description>
        <Description label="Valid until" className="grow">
          {dayjs(voucherInfo.expiredAt).format("DD/MM/YYYY")}
        </Description>
      </div>
      <p>
        Use code <strong>{voucherInfo.couponCode}</strong> when using services
        at {campaign.merchant.name} stores, including:
      </p>
      <ul className="pl-2 mt-2 ml-0 list-disc list-inside">
        {campaign.stores.map((store) => (
          <li key={store.id}>{store.name}</li>
        ))}
      </ul>
      <Button
        className="w-full mt-4"
        onClick={() => {
          gameState.setVoucherInfo(null);
          gameState.resetGame();
          gameState.closeModal();
        }}
      >
        Got it
      </Button>
    </div>
  );
};
export default GeneratedVoucherInfo;
