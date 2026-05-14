export const innkeeperFeatures = [
  {
    title: "Danh sách phòng",
    componentId: "RoomListOverview",
    icon: "mdi-list-box-outline",
    value: "RoomListOverview",
    path: "/quan-ly/danh-sach-phong",
  },
  {
    title: "Quản lý thông tin",
    icon: "mdi-cloud-print-outline",
    isGroup: true,
    parentVal: "infoManagement",
    children: [
      {
        title: "Quản lý hộ gia đình",
        icon: "mdi-home-account",
        componentId: "HouseholdList",
        value: "HouseholdList",
        path: "/quan-ly/ho-gia-dinh",
      },
      {
        title: "Quản lý thu phí",
        icon: "mdi-cash-sync",
        componentId: "FeeList",
        value: "FeeList",
        path: "/quan-ly/thu-phi",
      },
    ],
  },
  {
    title: "Danh mục",
    icon: "mdi-cloud-print-outline",
    isGroup: true,
    parentVal: "dictionary",
    children: [
      {
        title: "Tòa nhà",
        icon: "mdi-home-city",
        componentId: "BuildingList",
        value: "BuildingList",
        path: "/quan-ly/danh-muc/toa-nha",
      },
      {
        title: "Loại phòng",
        componentId: "RoomCategoryList",
        icon: "mdi-home-circle-outline",
        value: "RoomCategoryList",
        path: "/quan-ly/danh-muc/loai-phong",
      },
      {
        title: "Phòng",
        componentId: "RoomList",
        icon: "mdi-home-group",
        value: "RoomList",
        path: "/quan-ly/danh-muc/phong",
      },
      {
        title: "Hợp đồng cho thuê",
        componentId: "ContractList",
        icon: "mdi-file-sign",
        value: "ContractList",
        path: "/quan-ly/danh-muc/hop-dong-cho-thue",
      },
      {
        title: "Người thuê",
        componentId: "ResidentList",
        icon: "mdi-account-group-outline",
        value: "ResidentList",
        path: "/quan-ly/danh-muc/nguoi-thue",
      },
      {
        title: "Phí gửi xe",
        componentId: "VehicleFeeList",
        icon: "mdi-atv",
        value: "VehicleFeeList",
        path: "/quan-ly/danh-muc/phi-gui-xe",
      },
      {
        title: "Phí dịch vụ",
        componentId: "ServiceFeeList",
        icon: "mdi-currency-usd",
        value: "ServiceFeeList",
        path: "/quan-ly/danh-muc/phi-dich-vu",
      },
    ],
  },
];

export const renterFeatures = [
  {
    title: "Thông tin phòng",
    componentId: "RoomInfo",
    icon: "mdi-information-variant-circle-outline",
    path: "/quan-ly/thong-tin-phong",
  },
  {
    title: "Lịch biểu",
    componentId: "AppointmentSchedule",
    icon: "mdi-calendar-account-outline",
    value: "AppointmentSchedule",
    path: "/quan-ly/lich-bieu",
  },
  {
    title: "Quản lý chi tiêu",
    componentId: "Expense",
    icon: "mdi-calendar-account-outline",
    path: "/quan-ly/chi-tieu",
  },
  // {
  //   title: "Tính toán",
  //   componentId: "Calculation",
  //   icon: "mdi-calculator",
  //   path: "/quan-ly/tinh-toan",
  // },
  {
    title: "Danh mục",
    icon: "mdi-book-alphabet",
    isGroup: true,
    parentVal: "dictionary",
    path: "quan-ly/danh-muc",
    children: [
      {
        title: "Loại chi phí",
        icon: "mdi-invoice-list-outline",
        value: "ExpenseCategoryList",
        componentId: "ExpenseCategoryList",
        path: "quan-ly/danh-muc/loai-chi-phi",
      },
    ],
  },
];
