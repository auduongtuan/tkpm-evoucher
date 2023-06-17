import { Voucher, VoucherStatus } from "..";
import dayjs from "dayjs";
export function computeVoucherStatus<T extends Voucher>(
  voucher: T
): T & { status: VoucherStatus } {
  const currentDate = dayjs();
  let status = "unused" as VoucherStatus;
  if (voucher.usedAt) {
    status = "used";
  } else if (dayjs(voucher.expiredAt).isBefore(currentDate, "day")) {
    status = "expired";
  }
  return {
    ...voucher,
    status,
  };
}
