import { toast } from 'react-toastify';

const asyncToast = {
  load: (message) => toast.loading(message),
  update: (id, type, message) =>
    toast.update(id, {
      render: message,
      type,
      isLoading: false,
      autoClose: 2500,
    }),
};

export default asyncToast;
