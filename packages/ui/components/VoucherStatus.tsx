import { VoucherWithStatus } from "database";
import { Tag } from "antd";

const VoucherStatus = <T extends VoucherWithStatus>({
  voucher,
}: {
  voucher: T;
}) => {
  const colorMap = {
    unused: "green",
    used: "red",
    expired: "orange",
  };
  return (
    <Tag color={colorMap[voucher.status]} className="uppercase">
      {voucher.status}
    </Tag>
  );
};
export default VoucherStatus;
