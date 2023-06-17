import { useEffect, useRef, useState, useCallback } from "react";
import { Form, Input, Modal, Select, Row, Col, Typography } from "antd";
import type { InputRef } from "antd";
import {
  createStore,
  getCategories,
  getMerchants,
  getStore,
  updateStore,
} from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import { useQuery } from "@tanstack/react-query";
import useCrud from "@/hooks/useCrud";
import { MerchantSelect } from "@/components/RecordSelect";
import useGoogleMapAutocomplete from "./useGoogleMapAutocomplete";

const StoreForm = () => {
  const { modalProps, closeModal } = useRouteModal("/stores");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "store",
    form: form,
    getFn: getStore,
    onGetSuccess: (data) => {
      form.setFieldsValue({
        ...data,
        categoryIds: data.categories.map((category) => category.id),
      });
    },
    updateFn: updateStore,
    createFn: createStore,
    closeModal: closeModal,
  });
  const categoryListQuery = useQuery({
    queryKey: ["category_list"],
    queryFn: getCategories,
  });
  const { inputRef } = useGoogleMapAutocomplete({
    onPlaceChanged: (place) => {
      if (place.address_components) {
        form.setFieldValue(
          "address",
          place.address_components
            .map((component) =>
              component.types[0] != "postal_code"
                ? component.long_name
                : undefined
            )
            .filter((part) => part !== undefined)
            .join(", ")
        );
      }
      if (place.geometry && place.geometry.location) {
        form.setFieldValue("lat", place.geometry.location.lat());
        form.setFieldValue("lng", place.geometry.location.lng());
      }
    },
  });

  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Merchant"
            name={"merchantId"}
            rules={[{ required: true, message: "Please select a merchant!" }]}
          >
            <MerchantSelect
              onSelect={(value, { label }) => {
                form.setFieldValue("name", label + " ");
              }}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name={"categoryIds"}
            rules={[{ required: true, message: "Please select a merchant!" }]}
          >
            <Select
              showSearch
              mode="multiple"
              placeholder="Select categories"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                !categoryListQuery.isLoading && categoryListQuery.data
                  ? categoryListQuery.data.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input store name!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Typography.Title level={5}>Store Address</Typography.Title>
          <Input
            ref={inputRef}
            placeholder="Search for a location"
            className="mb-4"
          />
          <Form.Item
            label="Address"
            name={"address"}
            rules={[{ required: true, message: "Please input store address!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Lat"
                name={"lat"}
                rules={[{ required: true, message: "Please input store lat!" }]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Lng"
                name={"lng"}
                rules={[{ required: true, message: "Please input store lng!" }]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default StoreForm;
