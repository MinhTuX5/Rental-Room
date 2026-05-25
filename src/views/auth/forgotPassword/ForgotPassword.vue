<template>
  <form
    class="w-auto d-flex flex-column justify-center bg-white pa-8 rounded-lg position-relative"
    @submit.prevent="submit"
  >
    <v-icon
      icon="mdi-close"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      @click="close"
    />
    <div class="form-title text-h4 text-center mb-6">{{ title }}</div>

    <v-text-field
      label="Tài khoản*"
      v-model="model.account"
      :min-width="400"
      :error-messages="v$.account.$errors.map((e) => e.$message)"
      @blur="v$.account.$touch"
      @input="v$.account.$touch"
    ></v-text-field>

    <v-text-field
      label="OTP*"
      v-model="model.otp"
      density="compact"
      maxlength="4"
      :error-messages="v$.otp.$errors.map((e) => e.$message)"
      required
      @blur="v$.otp.$touch"
      @input="v$.otp.$touch"
    ></v-text-field>

    <div class="d-flex justify-center ga-3 mt-4">
      <v-btn
        type="button"
        text="Lấy OTP"
        color="green-lighten-1"
        :loading="loading"
        @click="requestOtp"
      />
      <v-btn
        type="button"
        text="Xác nhận OTP"
        color="blue-lighten-1"
        :disabled="!generatedOtp"
        @click="verifyOtp"
      />
    </div>

    <div class="register text-center mt-4">
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
