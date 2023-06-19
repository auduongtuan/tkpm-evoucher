import { InboxOutlined } from "@ant-design/icons";
import { Upload as AntUpload, message, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
const { Dragger } = AntUpload;
export interface UploadResponse {
  url: string;
  name: string;
  type: string;
}
const Upload = ({
  onUploadDone,
}: {
  onUploadDone?: (
    response: UploadResponse,
    info: UploadChangeParam<UploadFile<UploadResponse>>
  ) => void;
}) => {
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    action: "http://localhost:8180/upload",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("EMPLOYEE_TOKEN"),
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        onUploadDone && onUploadDone(info.file.response, info);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  );
};
export default Upload;
