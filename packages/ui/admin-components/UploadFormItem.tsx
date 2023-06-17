import { Form, Input } from "antd";
import { useId } from "react";
import Upload from "../components/Upload";
import { FormInstance, useWatch } from "antd/es/form/Form";
const UploadFormItem = ({
  form,
  fieldName = "image",
}: {
  form: FormInstance;
  fieldName?: string;
}) => {
  const id = useId();
  const image = useWatch(fieldName, form);

  return (
    <>
      <label htmlFor={id} className="block mb-2 text-sm">
        Image
      </label>
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
      <Upload
        onUploadDone={(response) => {
          form.setFieldValue(fieldName, response.url);
        }}
      ></Upload>
    </>
  );
};
export default UploadFormItem;
