<template>
  <div class="footer">
    <v-container>
      <v-row>
        <v-col
          v-for="col in infoCols"
          :key="col.title"
          :cols="12 / infoCols.length"
        >
          <h3 class="mb-2">{{ col.title }}</h3>
          <v-sheet
            v-for="child in col.children"
            :key="child.title"
            class="mt-2"
            color="light-green-darken-4"
          >
            {{ child.title }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  setup() {
    const infoCols = [
      {
        title: "Thông tin liên hệ",
        children: [
          { title: "0963689218", prefixIcon: "call" },
          { title: "nvthinh@gamil.com", prefixIcon: "mail" },
        ],
      },
      {
        title: "Về TimNhaTroViet.com",
        children: [
          { title: "Trang chủ", link: "" },
          { title: "Quản lý bài đăng", link: "" },
          { title: "Giới thiệu", link: "" },
          { title: "Quy định sử dụng", link: "" },
          { title: "Chính sách bảo mật", link: "" },
        ],
      },
      {
        title: "Hỗ trợ khách hàng",
        children: [{ title: "Gửi phản hồi", popupName: "" }],
      },
    ];

    return { infoCols };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: $light-green-darken-4;
  color: #fff;
}
</style>