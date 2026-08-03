import { gooeyToast } from "goey-toast";

export const toast = {
  success: (message) => gooeyToast.success(message),

  error: (message) => gooeyToast.error(message),

  warning: (message) => gooeyToast.warning(message),

  info: (message) => gooeyToast.info(message),
};
