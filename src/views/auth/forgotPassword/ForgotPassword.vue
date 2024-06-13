<template>
  <form
    class="w-auto d-flex flex-column justify-center bg-white pa-8 rounded-lg position-relative"
    @submit.prevent="submit"
  >
    <v-icon
      v-if="isExistEmail"
      icon="mdi-close"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      @click="close"
    />
    <div class="form-title text-h4 text-center mb-6">{{ title }}</div>

    <v-text-field
      v-if="!isExistEmail"
      label="Email*"
      type="email"
      v-model="model.email"
      :min-width="400"
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>

    <v-sheet v-if="isExistEmail">
      <v-text-field
        label="Mật khẩu*"
        v-model="model.password"
        density="compact"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        required
        :min-width="400"
        @blur="v$.password.$touch"
        @input="v$.password.$touch"
      ></v-text-field>

      <v-text-field
        label="Xác nhận mật khẩu*"
        v-model="model.passwordConfirmation"
        density="compact"
        :error-messages="v$.passwordConfirmation.$errors.map((e) => e.$message)"
        required
        @blur="v$.passwordConfirmation.$touch"
        @input="v$.passwordConfirmation.$touch"
      ></v-text-field>
    </v-sheet>

    <v-btn
      type="submit"
      :text="btnSubmitText"
      class="mx-auto mt-4"
      color="green-lighten-1"
      :loading="loading"
    />

    <div v-if="!isExistEmail" class="register text-center mt-4">
      <span>Đã có tài khoản? </span>
      <a href="#">Đăng nhập</a>
    </div>
  </form>
</template>


<script>
import { useForgotPassword } from "./forgotPassword";

export default {
  name: "ForgotPassword",
  setup() {
    const resource = useForgotPassword();
    return resource;
  },
};
</script>

<style lang="scss" scoped>
.v-text-field {
  & + .v-text-field {
    margin-top: 8px;
  }
}
</style>