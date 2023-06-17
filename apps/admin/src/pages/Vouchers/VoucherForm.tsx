import { useState } from "react";
import { Form, Input, Modal, Checkbox, Select, DatePicker } from "antd";
import { createVoucher, getVoucher, updateVoucher } from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";
import { CampaignSelect, UserSelect } from "@/components/RecordSelect";
import dayjs from "dayjs";

const VoucherForm = () => {
  const { modalProps, closeModal } = useRouteModal("/vouchers");
  const [form] = Form.useForm();
  const { id, formModalProps } = useCrud({
    name: "voucher",
    getFn: getVoucher,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data, expiredAt: dayjs(data.expiredAt) });
    },
    updateFn: updateVoucher,
    createFn: createVoucher,
    closeModal: closeModal,
    form: form,
  });
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
          {/* couponCode: Type.String({ minLength: 1 }),
  campaignId: Type.Integer(),
  userId: Type.Integer(),
  discountType: Type.Union([Type.Literal("PERCENT"), Type.Literal("FIXED")]),
  discountValue: Type.Number(),
  maxDiscount: Type.Optional(Type.Number()),
  expiredAt: Type.Optional(Type.String({ format: "date-time" })), */}
          <Form.Item
            label="Campaign"
            name={"campaignId"}
            rules={[
              { required: true, message: "Please select voucher campaign!" },
            ]}
          >
            <CampaignSelect />
          </Form.Item>

          <Form.Item
            label="User"
            name={"userId"}
            rules={[{ required: true, message: "Please select voucher user!" }]}
          >
            <UserSelect />
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
