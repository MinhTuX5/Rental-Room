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
export const scrollTo = (
  goTo,
  to,
  offset = 0,
  duration = 0,
  target = "By Number"
) => {
  const scrollOptions = {
    // container: container,
    duration,
    easing: "easeInOutQuad", // Hiệu ứng chuyển động bắt đầu từ chậm đến nhanh rồi chậm lại theo hàm bậc hai.
    offset,
    target,
  };

  goTo(to, scrollOptions);
};

export const moveToTop = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

/**
 * @description đăng xuất
 */
export const logout = () => {
  localStorage.removeItem("context");
  contextStore.$reset();
};

//#region Format
export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const convertCurrencyFormat = (input) => {
  // Kiểm tra xem input có chứa dấu chấm hay không
  if (typeof input === "string" && input.includes(".")) {
    // Nếu có dấu chấm trong chuỗi, loại bỏ dấu chấm và chuyển về kiểu Number
    return Number(input.replace(/\./g, ""));
  } else if (typeof input === "number") {
    // Nếu là số, chuyển về định dạng chuỗi với dấu chấm ngăn cách
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return input;
};
//#endregion
