export const useRoomSearchCommon = () => {
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

  return { filters };
};
