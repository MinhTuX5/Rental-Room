import { ref } from "vue";
import moment from "moment";
// utilities
import superscriptCharacters from "@/utilities/superscriptCharacters";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";

export const usePostDetail = () => {
  const roomSearchCommon = useRoomSearchCommon();

  const model = ref({
    address: "206/20 Đường số 20, Phường 5, Quận Gò Vấp, Hồ Chí Minh",
    price: 2800000,
    area: 18,
    posted_date: new Date(),
    noOfBedrooms: 2,
    description:
      "-Vị trí: Cuối đường số 20 Dương Quãng Hàm, rẻ phải (tòa nhà 5 lầu màu trắng). Gần trường Công nghiệp 4 (5 phút), Cao đẵng Bách Việt..Gần các khu giải trí cho các bạn thõa sức vui chơi như Gần bên CGV gò vấp cách bạn 10p đi xe dể dàng tận hưởng nhưng bộ phim bom tấn. 15p tới E-mart...\n -Thuận lợi đi lại cho các quận ( Bình Thạnh, Thủ Đức, Q.12,Tân Bình...)\n-Toàn bộ phòng được lót gạch men nên phòng trong rất sạch sẽ và cao ốc, Wc từng phòng.\n-Thang máy lên tới tận phòng.",
  });

  return { model, moment, superscriptCharacters, roomSearchCommon };
};
