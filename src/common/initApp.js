import { useContextStore } from "@/stores/contextStore";
import { useLocationStore } from "@/stores/location/locationStore";

const indexedDBrequest = indexedDB.open("CacheDB", 1);
indexedDBrequest.onupgradeneeded = (event) => {
  let db = event.target.result;
  if (!db.objectStoreNames.contains("Location")) {
    db.createObjectStore("Location", {
      keyPath: "location_id",
    }); // create it
  }
};

indexedDBrequest.onsuccess = function (event) {
  console.log("...the db is ready, use it...");
  const db = event.target.result;
  const transaction = db.transaction("Location", "readonly");
  const objectStore = transaction.objectStore("Location");

  const request = objectStore.getAll(); // Lấy tất cả dữ liệu hiện có

  request.onsuccess = function (event) {
    const existingData = event.target.result;
    const locationStore = useLocationStore();
    if (existingData.length === 0) {
      locationStore.getAllLocations().then((res) => {
        if (Array.isArray(res)) {
          res.forEach((x) => {
            addToIndexDB(db, x);
          });
        }
      });
    } else {
      locationStore.setItems(existingData);
    }
  };
};

// Hàm để thêm dữ liệu vào IndexedDB
function addToIndexDB(db, data) {
  const transaction = db.transaction("Location", "readwrite");
  const objectStore = transaction.objectStore("Location");
  const request = objectStore.add(data);

  request.onerror = function (event) {
    console.error("Lỗi khi thêm dữ liệu:", event.target.error);
  };
}

export function initApp() {
  // Add this function at the beginning of your file or in a separate utility file
  String.prototype.format = function (...args) {
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== "undefined" ? args[number] : match;
    });
  };

  // Prototype của hàm sắp xếp mảng theo trường thông tin muốn sắp xếp tăng dần
  Array.prototype.sortByField = function (fieldName) {
    this.sort(function (a, b) {
      if (a[fieldName] < b[fieldName]) {
        return -1;
      }
      if (a[fieldName] > b[fieldName]) {
        return 1;
      }
      return 0;
    });
  };

  const setContextData = () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    // Trả về true nếu đã đăng nhập, ngược lại trả về false
    const context = localStorage.getItem("context");
    if (context) {
      const contextObj = JSON.parse(context);
      if (contextObj.accessToken == "123456789") {
        const store = useContextStore();
        store.$state = {
          ...store.$state,
          ...contextObj,
        };
      }
    }
  };

  setContextData();
}
