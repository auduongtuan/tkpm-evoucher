import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const useRouteModal = (parentPath: string) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(true);
  }, []);
  const closeModal = () => {
    setOpen(false);
  };
  return {
    modalProps: {
      open: open,
      onCancel: closeModal,
      afterClose: () => {
        navigate(parentPath);
      },
    },
    setOpen,
    closeModal,
  };
};
export default useRouteModal;
