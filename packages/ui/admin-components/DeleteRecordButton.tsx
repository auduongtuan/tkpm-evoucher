import { Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
const DeleteRecordButton = ({
  mutationFn,
  id,
  name = "this record",
  queryKey,
}: {
  mutationFn: (id: number) => Promise<any>;
  id: number;
  name?: string;
  queryKey?: string[];
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data, variables, context) => {
      if (queryKey) queryClient.invalidateQueries({ queryKey: queryKey });
      message.info(`Record ${name} deleted`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code == "PRISMA_P2003") {
          message.info(
            `Cannot delete. You must unset all campaigns using ${name} first.`
          );
        }
      }
    },
  });
  const handleDelete = async (id: number) => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${name}?`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        deleteMutation.mutate(id);
      },
    });
  };
  return (
    <>
      {contextHolder}
      <Button
        type="link"
        danger
        onClick={async (e) => {
          e.preventDefault();
          await handleDelete(id);
          return;
        }}
      >
        Delete
      </Button>
    </>
  );
};
export default DeleteRecordButton;
