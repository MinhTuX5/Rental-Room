// router
import router from "@/router";
// resources
import { showMessage } from "@/common/commonFunction";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";

export const useRoomSearchCommon = () => {
  const contextStore = useContextStore();

  const filters = [
    {
      label: "Đặc điểm nổi bật",
      children: [
        {
          label: "Không chung chủ",
          value: 0,
        },
        {
          label: "Phòng khép kín",
          value: 1,
        },
        {
          label: "Giờ giấc tự do",
          value: 2,
        },
      ],
    },
    {
      id: 2,
      label: "Tiện ích",
      children: [
        {
          label: "Chỗ để xe",
          value: 3,
        },
        {
          label: "Khu vực nấu ăn",
          value: 4,
        },
        {
          label: "Khóa vân tay",
          value: 5,
        },
        {
          label: "Camera",
          value: 6,
        },
      ],
    },
    {
      label: "Trang thiết bị",
      children: [
        {
          label: "Bình nóng lạnh",
          value: 7,
        },
        {
          label: "Điều hòa",
          value: 8,
        },
        {
          label: "Tủ lạnh",
          value: 9,
        },
        {
          label: "Giường/Tủ",
          value: 10,
        },
      ],
    },
    {
      label: "Vị trí",
      children: [
        {
          label: "Gần chợ",
          value: 11,
        },
      ],
    },
  ];

  /**
   * @description Yêu thích/Hủy yêu thích bài viết
   */
  const lovePost = async (param) => {
    if (!param) {
      param = {};
    }

    const roomPostStore = useRoomPostStore();
    if (typeof roomPostStore.lovePost === "function") {
      const payload = {
        ...param,
        user_id: contextStore.$state.userID,
      };

      if (!payload.room_post_id || !payload.user_id) {
        return;
      }

      try {
        const favoritePostID = await roomPostStore.lovePost(payload);

        if (favoritePostID) {
          showMessage("Đã yêu thích bài viết");
        } else {
          showMessage("Đã hủy yêu thích bài viết");
        }

        return favoritePostID;
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * @description đăng xuất
   */
  const logout = () => {
    localStorage.removeItem("context");
    contextStore.$reset();
    router.push('/');
  };

  return { filters, lovePost, logout };
};
