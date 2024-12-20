// stores
import { useAppStore } from "@/stores/appStore";

// Create a function to introduce a delay
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MessageType = {
  Success: "success",
};

export const showMessage = (
  content = "Thao tác thành công",
  type = MessageType.Success
) => {
  const appStore = useAppStore();
  appStore.alertType = type;
  appStore.alertMessage = content;
  appStore.showAlert = true;

  setTimeout(() => {
    appStore.showAlert = false;
  }, 2000);
};

//#region Validate
export const isJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
//#endregion

/**
 * @description Cuộn trang tới
 * @param {String, Number} to Scroll to
 * @param {String} target ['By Number', 'By Query Selector', 'By Component / Element']
 * @param {Number} offset
 * @param {*} container
 */
export const scrollTo = (goTo, to, offset = 0, target = "By Number") => {
  const scrollOptions = {
    // container: container,
    duration: 100,
    easing: "easeInOutQuad", // Hiệu ứng chuyển động bắt đầu từ chậm đến nhanh rồi chậm lại theo hàm bậc hai.
    offset,
    target,
  };

  goTo(to, scrollOptions);
};
