// stores
import { useLocationStore } from "@/stores/location/locationStore";
// enum
import LocationType from "@/common/enum/LocationType";

const locationStore = useLocationStore();

const LocationConfig = [
  {
    label: "Chọn Tỉnh/Thành phố",
    locationType: LocationType.Province,
    idField: locationStore.$state.idField,
    nameField: locationStore.$state.nameField,
    modelField: "province_id",
    items: locationStore.provinceItems,
    noDataText: "Không có dữ liệu",
  },
  {
    label: "Chọn Quận/Huyện",
    locationType: LocationType.District,
    items: [],
    noDataText: "Chưa có Tỉnh/Thành phố nào được chọn",
    idField: locationStore.$state.idField,
    nameField: locationStore.$state.nameField,
    modelField: "district_id",
  },
  {
    label: "Chọn Phường/Xã",
    locationType: LocationType.Ward,
    items: [],
    noDataText: "Chưa có Quận/Huyện nào được chọn",
    idField: locationStore.$state.idField,
    nameField: locationStore.$state.nameField,
    modelField: "ward_id",
  },
];

export default LocationConfig;
