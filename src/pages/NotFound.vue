<template>
  <v-empty-state
    headline="Có lỗi xảy ra, 404"
    title="Không tìm thấy trang"
    text="Trang bạn đang tìm kiếm không tồn tại"
    image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
  ></v-empty-state>
</template>

<script>
export default {
  name: "NotFound",
  setup() {},
};
</script>

<style scoped>
.main {
  position: relative;
  height: 100vh;
}
</style>