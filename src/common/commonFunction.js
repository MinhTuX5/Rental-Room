// libraries
import moment from "moment";
// stores
import { useAppStore } from "@/stores/appStore";
import { useContextStore } from "../stores/contextStore";
// enum
import _enum from "./enum";
import notificationAPI from "@/apis/notificationAPI/notificationAPI";

// Create a function to introduce a delay
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MessageType = {
  Success: "success",
  Warning: "warning",
  Error: "error",
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
  useContextStore().$reset();
  localStorage.removeItem("context");
  window.location.href = "/";
};

//#region Format
export const formatNumberWithCommas = (number) => {
  if (typeof number === "number") {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return number;
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

export const formatDate = (date) => {
  const validDate = date ?? new Date();
  return moment(validDate).format("DD/MM/YYYY");
};

export const getEnumItem = (item, enumFields) => {
  item = item ?? {};

  if (Array.isArray(enumFields) && enumFields.length) {
    enumFields.forEach((x) => {
      const keys = Object.keys(_enum[x.enum]);
      const key = keys.find((y) => _enum[x.enum][y] == item[x.field]);
      if (key) item[x.column] = key;
    });
  }

  return item;
};

export const getNumberItem = (item, numberFields) => {
  numberFields.forEach((y) => {
    item[y] = formatNumberWithCommas(item[y]);
  });
  return item;
};

export const getDateItem = (item, dateFields) => {
  if (!Array.isArray(dateFields) || dateFields.length === 0) {
    return item;
  }

  dateFields.forEach((field) => {
    const col = `displayed_${field}`;
    item[col] = moment(item[field]).format("DD/MM/YYYY");
  });
  return item;
};

export const standardItem = (item, options = {}) => {
  if (Array.isArray(options.enumFields)) {
    item = getEnumItem(item, options.enumFields);
  }

  if (Array.isArray(options.numberFields)) {
    item = getNumberItem(item, options.numberFields);
  }

  if (Array.isArray(options.dateFields)) {
    item = getDateItem(item, options.dateFields);
  }

  return item;
};
//#endregion

//#region Get context
export const getContext = () => {
  const context = localStorage.getItem("context");
  if (context) {
    try {
      return JSON.parse(context);
    } catch (error) {
      console.error("Error parsing context from local storage:", error);
      return null;
    }
  }
  return null;
};

export const getManagementContext = () => {
  const context = localStorage.getItem("context_management");
  if (context) {
    try {
      return JSON.parse(context);
    } catch (error) {
      console.error("Error parsing context from local storage:", error);
      return null;
    }
  }
  return null;
};
//#endregion

export const readNotify = (notificationId) => {
  notificationAPI.readNotify(notificationId);
};
