<template>
  <v-empty-state
    headline="Có lỗi xảy ra, 404"
    title="Không tìm thấy trang"
    text="Trang bạn đang tìm kiếm không tồn tại"
    image="/src/assets/imgs/common/NotFound.png"
    action-text="Quay lại trang chủ"
    @click:action="onClickAction"
  ></v-empty-state>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
  name: "NotFound",
  setup() {
    const { proxy } = getCurrentInstance();
    const onClickAction = () => {
      const me = proxy;
      // Redirect to home page
      me.$router.push("/");
    };

    return {
      onClickAction,
    };
  },
};
</script>

<style scoped>
.main {
  position: relative;
  height: 100vh;
}
</style>