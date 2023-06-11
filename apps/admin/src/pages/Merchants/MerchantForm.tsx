import {
  Form,
  Input,
  Modal,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import { createMerchant, getMerchant, updateMerchant } from "api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";
import { InboxOutlined } from "@ant-design/icons";
import { useWatch } from "antd/es/form/Form";
const { Dragger } = Upload;

const MerchantForm = () => {
  const { modalProps, closeModal } = useRouteModal("/merchants");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "merchant",
    getFn: getMerchant,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateMerchant,
    createFn: createMerchant,
    closeModal: closeModal,
    form: form,
  });
  const image = useWatch("image", form);
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:8080/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        form.setFieldsValue({ image: info.file.response.url });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input merchant name!" }]}
          >
            <Input></Input>
          </Form.Item>
          <label className="block mb-2 text-sm">Image</label>
          {image && <img src={image} className="max-w-full mb-4 rounded-md" />}
          <Form.Item
            label="Image"
            name={"image"}
            hidden
            shouldUpdate
            // rules={[{ type: "url", message: "Please input valid url" }]}
          >
            <Input type="hidden"></Input>
          </Form.Item>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Form>
      </Modal>
    </>
  );
};
export default MerchantForm;
