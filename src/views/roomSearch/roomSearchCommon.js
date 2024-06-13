export const useRoomSearchCommon = () => {
  const filters = [
    {
      label: "Đặc điểm nổi bật",
      children: [
        {
          label: "Không chung chủ",
        },
        {
          label: "Phòng khép kín",
        },
        {
          label: "Giờ giấc tự do",
        },
      ],
    },
    {
      id: 2,
      label: "Tiện ích",
      children: [
        {
          label: "Chỗ để xe",
        },
        {
          label: "Khu vực nấu ăn",
        },
        {
          label: "Khóa vân tay",
        },
        {
          label: "Camera",
        },
      ],
    },
    {
      label: "Trang thiết bị",
      children: [
        {
          label: "Bình nóng lạnh",
        },
        {
          label: "Điều hòa",
        },
        {
          label: "Tủ lạnh",
        },
        {
          label: "Giường/Tủ",
        },
      ],
    },
    {
      label: "Vị trí",
      children: [
        {
          label: "Gần chợ",
        },
      ],
    },
  ];

  return { filters };
};
