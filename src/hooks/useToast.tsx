// src/hooks/useToast.tsx
import { toast } from "sonner";

const useToast = () => {
  const showToast = (
    message: string,
    description?: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    switch (type) {
      case "success":
        toast.success(message, { description });
        break;
      case "error":
        toast.error(message, { description });
        break;
      case "warning":
        toast.warning(message, { description });
        break;
      default:
        toast(message, { description });
        break;
    }
  };

  return { showToast };
};

export default useToast;
