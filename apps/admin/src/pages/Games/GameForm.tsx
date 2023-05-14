import { Form, Input, Modal } from "antd";
import { createGame, getGame, updateGame } from "@/api-client";
import useRouteModal from "@/hooks/useRouteModal";
import useCrud from "@/hooks/useCrud";

const GameForm = () => {
  const { modalProps, closeModal } = useRouteModal("/games");
  const [form] = Form.useForm();
  const { formModalProps } = useCrud({
    name: "game",
    getFn: getGame,
    onGetSuccess: (data) => {
      form.setFieldsValue({ ...data });
    },
    updateFn: updateGame,
    createFn: createGame,
    closeModal: closeModal,
    form: form,
  });

  return (
    <>
      <Modal {...modalProps} {...formModalProps}>
        <Form layout="vertical" autoComplete="off" form={form} className="my-4">
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input game name!" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Slug"
            name={"slug"}
            rules={[{ required: true, message: "Please input game slug!" }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default GameForm;
