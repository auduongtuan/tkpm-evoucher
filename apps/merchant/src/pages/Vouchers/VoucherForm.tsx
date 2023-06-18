import { useState } from "react";
import { Form, Input, Modal, Checkbox, Select, DatePicker } from "antd";
import {
  createVoucher,
  getMerchantCampaigns,
  getVoucher,
  updateVoucher,
} from "api-client";
import useRouteModal from "ui/hooks/useRouteModal";
import useCrud from "ui/hooks/useCrud";
import { CampaignSelect, UserSelect } from "ui/admin-components/RecordSelect";
import UserFindSelect from "ui/admin-components/UserFindSelect";
import dayjs from "dayjs";
import useAdminStore from "ui/hooks/useAdminStore";
import { User } from "database";

const VoucherForm = () => {
  const { modalProps, closeModal } = useRouteModal("/vouchers");
  const [form] = Form.useForm();
  const [options, setOptions] = useState<User[]>([]);
  const { id, formModalProps } = useCrud({
    name: "voucher",
    getFn: getVoucher,
    onGetSuccess: (data) => {
      form.setFieldsValue({
        ...data,
        expiredAt: dayjs(data.expiredAt),
        usedAt: data.usedAt ? dayjs(data.usedAt) : null,
      });
      setOptions([data.user]);
    },
    updateFn: updateVoucher,
    createFn: createVoucher,
    closeModal: closeModal,
    form: form,
  });
  const merchantId = useAdminStore(
    (state) => state.employee?.merchantId
  ) as number;

  const discountType = Form.useWatch("discountType", form);
  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Coupon code"
            name={"couponCode"}
            rules={[
              { required: true, message: "Please input voucher coupon code!" },
            ]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item
            label="Campaign"
            name={"campaignId"}
            rules={[
              { required: true, message: "Please select voucher campaign!" },
            ]}
          >
            <CampaignSelect
              getFn={async () => getMerchantCampaigns(merchantId)}
            />
          </Form.Item>

          <Form.Item
            label="User"
            name={"userId"}
            help={
              <p className="mt-1.5 mb-2">
                Search by user email or phone number
              </p>
            }
            rules={[{ required: true, message: "Please select voucher user!" }]}
          >
            <UserFindSelect
              options={options.map((options) => ({
                value: options.id,
                label: options.fullName,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Discount type"
            name={"discountType"}
            rules={[
              {
                required: true,
                message: "Please select voucher discount type!",
              },
            ]}
          >
            <Select
              options={[
                { value: "FIXED", label: "Fixed" },
                { value: "PERCENT", label: "Percent" },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            label="Discount Value"
            name={"discountValue"}
            rules={[
              { required: true, message: "Please input voucher coupon value!" },
            ]}
          >
            <Input
              type="number"
              min={0}
              suffix={discountType == "PERCENT" ? "%" : "VND"}
            ></Input>
          </Form.Item>
          <Form.Item label="Maximum Discounted Value" name={"maxDiscount"}>
            <Input
              type="number"
              min={0}
              max={discountType == "FIXED" ? 100 : undefined}
              suffix={discountType == "FIXED" ? "%" : "VND"}
            ></Input>
          </Form.Item>
          <Form.Item label="Expired at" name={"expiredAt"}>
            <DatePicker showTime></DatePicker>
          </Form.Item>
          <Form.Item label="Used at" name={"usedAt"}>
            <DatePicker showTime></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default VoucherForm;
