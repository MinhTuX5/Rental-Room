// stores
import { useLocationStore } from "@/stores/location/locationStore";
// enum
import LocationType from "@/common/enum/LocationType";

const locationStore = useLocationStore();

const LocationConfig = [
  {
    label: "Chọn Tỉnh/Thành phố",
    locationType: LocationType.Province,
    items: locationStore.provinceItems.map((x) => x.location_name),
    noDataText: "Không có dữ liệu",
  },
  {
    label: "Chọn Quận/Huyện",
    locationType: LocationType.District,
    items: [],
    noDataText: "Chưa có Tỉnh/Thành phố nào được chọn",
  },
  {
    label: "Chọn Phường/Xã",
    locationType: LocationType.Ward,
    items: locationStore.wardItems.map((x) => x.location_name),
    noDataText: "Chưa có Quận/Huyện nào được chọn",
  },
];

export default LocationConfig;
