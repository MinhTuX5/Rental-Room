<template>
  <v-container>
    <v-row align="center">
      <v-col
        v-for="searchItem in searchConfig"
        :key="searchItem.label"
        cols="2"
        align-self="center"
      >
        <v-combobox label="Loại nhà đất" :items="searchItem.items"></v-combobox>
      </v-col>
      <v-col cols="2">
        <v-btn color="#42b983">Tìm kiếm</v-btn>
      </v-col>
    </v-row>
    <v-col>
      <v-sheet align="center">
        <h1>Cho Thuê Phòng Trọ, Thuê Nhà Trọ Giá Rẻ, Chính Chủ</h1>
      </v-sheet>
      <v-sheet align="center"
        >Cho thuê phòng trọ, nhà trọ giá rẻ hàng đầu Việt Nam - Cập nhật thông
        tin cho thuê phòng trọ nhanh chóng, chính xác, thông tin xác
        thực.</v-sheet
      >
    </v-col>
    <v-col>
      <v-sheet>
        <h2>Khu vực nổi bật</h2>
      </v-sheet>
      <v-row align-content="space-around">
        <v-col v-for="item in popularPlaces" :key="item.location">
          <h3 class="text-center">{{ item.location }}</h3>
          <v-img aspect-ratio="16/9" cover :src="item.image"></v-img>
        </v-col>
      </v-row>
    </v-col>
    <v-row class="mt-2">
      <v-col cols="9" class="border-thin pa-4">
        <h3>Tổng {{ postDetails?.length ?? 0 }} kết quả</h3>
        <v-sheet class="d-flex align-center">
          <h3 class="mr-1">Sắp xếp:</h3>
          <span class="mr-4">Mới nhất</span>
          <span class="mr-4">Giá cả</span>
          <span>Số lượng tương tác</span>
        </v-sheet>
        <v-sheet
          v-for="(item, index) in postDetails"
          :key="index"
          class="d-flex align-center border-thin mt-2"
        >
          <v-col cols="4" align-self="center">
            <v-img
              aspect-ratio="1/1"
              cover
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
            ></v-img>
          </v-col>
          <v-col cols="8">
            <v-sheet
              ><a href="">{{ item.title }}</a></v-sheet
            >
            <v-sheet>{{ item.price }} đồng/tháng</v-sheet>
            <v-sheet>{{ item.area }} m²</v-sheet>
            <v-sheet>{{ item.description }}</v-sheet>
            <v-row class="mt-2" justify="space-between">
              <v-col class="mr-2">
                <v-icon icon="$vuetify"></v-icon>
                <span>{{ item.author }}</span>
              </v-col>
              <v-col class="mr-2">
                <v-icon icon="$vuetify"></v-icon>
                <span>Vũ Anh Tú</span>
              </v-col>
              <v-col>
                <v-icon icon="$vuetify"></v-icon>
                <span>{{ item.address }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-sheet>
      </v-col>
      <v-col class="border-thin ml-2">
        <v-sheet>
          <h2>Lọc</h2>
        </v-sheet>
        <v-sheet>
          <h3>Đặc điểm nổi bật</h3>
          <v-checkbox density="compact" label="Không chung chủ"></v-checkbox>
          <v-checkbox density="compact" label="Phòng khép kín"></v-checkbox>
          <v-checkbox density="compact" label="Giờ giấc tự dos"></v-checkbox>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row class="border-thin why" align="center">
      <v-sheet>Tại sao lại chọn TimNhaTroViet.com?</v-sheet>
      <v-sheet
        >Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng TimNhaTroViet.com tự
        hào là trang web đứng top google về các từ khóa: cho thuê phòng trọ, nhà
        trọ, thuê nhà nguyên căn, cho thuê căn hộ, tìm người ở ghép, cho thuê
        mặt bằng...Vì vậy tin của bạn đăng trên website sẽ tiếp cận được với
        nhiều khách hàng hơn, do đó giao dịch nhanh hơn, tiết kiệm chi phí
        hơn</v-sheet
      >
      <v-sheet class="d-flex justify-space-between">
        <v-sheet class="d-flex flex-column">
          <h4>Thành viên</h4>
          <span>116.998+</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Tin đăng</h4>
          <span>103.348+</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Lượt truy cập/tháng</h4>
          <span>300000</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Lượt xem/tháng</h4>
          <span>2.500.000+</span>
        </v-sheet>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "RoomSearchView",
  setup() {
    const searchConfig = [
      {
        label: "Loại nhà đất",
        items: [
          {
            title: "Tất cả",
            value: 0,
          },
          {
            title: "Phòng trọ, nhà trọ",
            value: 1,
          },
          {
            title: "Nhà thuê nguyên căn",
            value: 2,
          },
          {
            title: "Cho thuê căn hộ",
            value: 3,
          },
        ],
      },
      {
        label: "Chọn giá",
        items: [
          {
            title: "Tất cả",
            value: 0,
          },
          {
            title: "Phòng trọ, nhà trọ",
            value: 1,
          },
          {
            title: "Nhà thuê nguyên căn",
            value: 2,
          },
          {
            title: "Cho thuê căn hộ",
            value: 3,
          },
        ],
      },
      {
        label: "Loại nhà đất",
        items: [
          {
            title: "Tất cả",
            value: 0,
          },
          {
            title: "Phòng trọ, nhà trọ",
            value: 1,
          },
          {
            title: "Nhà thuê nguyên căn",
            value: 2,
          },
          {
            title: "Cho thuê căn hộ",
            value: 3,
          },
        ],
      },
      {
        label: "Chọn giá",
        items: [
          {
            title: "Tất cả",
            value: 0,
          },
          {
            title: "Phòng trọ, nhà trọ",
            value: 1,
          },
          {
            title: "Nhà thuê nguyên căn",
            value: 2,
          },
          {
            title: "Cho thuê căn hộ",
            value: 3,
          },
        ],
      },
      {
        label: "Chọn giá",
        items: [
          {
            title: "Tất cả",
            value: 0,
          },
          {
            title: "Phòng trọ, nhà trọ",
            value: 1,
          },
          {
            title: "Nhà thuê nguyên căn",
            value: 2,
          },
          {
            title: "Cho thuê căn hộ",
            value: 3,
          },
        ],
      },
    ];

    const popularPlaces = [
      {
        location: "Hà Nội",
        image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      },
      {
        location: "Đà Nẵng",
        image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      },
      {
        location: "Hồ Chí Minh",
        image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      },
    ];

    const postDetails = [
      {
        title:
          "Chung cư mini thoáng mát 35m2 tại sô nhà 46 ngõ 204 Trần Duy Hưng",
        price: 1200000,
        area: 30,
        description:
          "Cho thuê phòng , NHẬN PHÒNG Ở LUÔN TỪ 1.5.24. Diện tích phòng 12m2, KHÔNG KHÉP KÍN. CÓ ĐIỀU HOÀ. Phòng sạch sẽ, không gian thoáng mát, yên tĩnh,…",
        author: "Nguyễn Huệ",
        address:
          "Số 25A, ngõ 139 Nguyễn Ngọc Vũ, phường Trung Hòa, quận Cầu Giấy, thành phố Hà Nội",
      },
      {
        title: "CCMN đầy đủ tiện nghi không cần nghĩ suy",
        price: 5000000,
        area: 35,
        description:
          "Cho thuê phòng , NHẬN PHÒNG Ở LUÔN TỪ 1.5.24. Diện tích phòng 12m2, KHÔNG KHÉP KÍN. CÓ ĐIỀU HOÀ. Phòng sạch sẽ, không gian thoáng mát, yên tĩnh,…",
        author: "Nguyễn Tất Thành",
        address:
          "Số 25A, ngõ 139 Nguyễn Ngọc Vũ, phường Trung Hòa, quận Cầu Giấy, thành phố Hà Nội",
      },
    ];

    const tabVal = ref(1);

    return {
      searchConfig,
      tabVal,
      popularPlaces,
      postDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
.why {
  .v-sheet {
    width: 100%;
    text-align: center;
  }
}
</style>