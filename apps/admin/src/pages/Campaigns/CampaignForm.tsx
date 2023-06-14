import { useState } from "react";
import { DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

import {
  createCampaign,
  getCampaign,
  updateCampaign,
  getMerchant,
  getGames,
} from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";
import { MerchantSelect } from "@/components/RecordSelect";
import { useQuery } from "@tanstack/react-query";
const CampaignForm = () => {
  const { modalProps, closeModal } = useRouteModal("/campaigns");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "campaign",
    getFn: getCampaign,
    onGetSuccess: (data) => {
      form.setFieldsValue({
        ...data,
        storeIds: data.stores.map((store) => store.id),
        gameIds: data.games.map((game) => game.id),
        timeRange:
          data.startedAt && data.endedAt
            ? [dayjs(data.startedAt), dayjs(data.endedAt)]
            : [dayjs(), null],
      });
      setMerchantId(data.merchantId);
    },
    updateFn: updateCampaign,
    createFn: createCampaign,
    closeModal: closeModal,
    valuesFilter: (values: {
      timeRange: [Dayjs, Dayjs];
      [key: string]: any;
    }) => {
      const { timeRange, ...rest } = values;
      const filteredValues = {
        ...rest,
        ...(timeRange
          ? {
              startedAt: timeRange[0].toDate(),
              endedAt: timeRange[1].toDate(),
            }
          : {}),
      };
      return filteredValues;
    },
    form: form,
  });
  const [merchantId, setMerchantId] = useState<number>();
  const merchantQuery = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: async () => await getMerchant(merchantId as number),
    enabled: !!merchantId,
  });
  const gameListQuery = useQuery({
    queryKey: ["game", "list"],
    queryFn: getGames,
  });
  const onValuesChange = ({ merchantId }) => {
    if (merchantId) setMerchantId(merchantId);
  };
  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        required: true,
        message: "Please select time!",
      },
    ],
  };

  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{
            startedAt: "",
            endedAt: "",
          }}
          className="my-4"
        >
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input campaign name!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Description"
            name={"description"}
            rules={[{ required: true, message: "Please input campaign name!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Merchant"
            name={"merchantId"}
            rules={[{ required: true, message: "Please select merchant!" }]}
          >
            <MerchantSelect />
          </Form.Item>
          {merchantId && (
            <Form.Item
              label="Stores applied"
              name={"storeIds"}
              rules={[
                { required: true, message: "Please select applied stores!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select applied stores"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  !merchantQuery.isLoading && merchantQuery.data
                    ? merchantQuery.data.stores.map((store) => ({
                        value: store.id,
                        label: store.name,
                      }))
                    : []
                }
              />
            </Form.Item>
          )}
          <Form.Item
            label="Games"
            name={"gameIds"}
            rules={[{ required: true, message: "Please select games!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select games"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                !gameListQuery.isLoading && gameListQuery.data
                  ? gameListQuery.data.map((game) => ({
                      value: game.id,
                      label: game.name,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            label="Total Budget"
            name={"totalBudget"}
            rules={[
              {
                required: true,
                message: "Please input total budget!",
              },
            ]}
          >
            <Input type="number" min={0} step={500} suffix={"VND"}></Input>
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
          <Form.Item label="Max Voucher Percent" name={"maxVoucherPercent"}>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              suffix={"%"}
            ></Input>
          </Form.Item>
          <Form.Item label="Max Voucher Fixed Value" name={"maxVoucherFixed"}>
            <Input type="number" min={0} step={500} suffix={"VND"}></Input>
          </Form.Item>

          <Form.Item name="timeRange" label="Time applied" {...rangeConfig}>
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              className="w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CampaignForm;
