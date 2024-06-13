<template>
  <v-sheet
    class="h-screen align-center d-flex flex-column justify-center"
    color="blue-grey-lighten-1"
  >
    <form
      class="w-auto d-flex flex-column justify-center bg-white pa-8 rounded-lg"
    >
      <div class="form-title text-h4 text-center mb-6">Đăng ký</div>

      <v-text-field
        label="Email*"
        type="email"
        v-model="state.email"
        density="compact"
        :min-width="400"
        required
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        @blur="v$.email.$touch"
        @input="v$.email.$touch"
      ></v-text-field>

      <v-text-field
        label="Họ và tên*"
        v-model="state.fullName"
        density="compact"
        :error-messages="v$.fullName.$errors.map((e) => e.$message)"
        required
        @blur="v$.fullName.$touch"
        @input="v$.fullName.$touch"
      ></v-text-field>

      <v-text-field
        label="Số điện thoại*"
        v-model="state.phoneNumber"
        density="compact"
        :error-messages="v$.phoneNumber.$errors.map((e) => e.$message)"
        required
        @blur="v$.phoneNumber.$touch"
        @input="v$.phoneNumber.$touch"
      ></v-text-field>

      <v-text-field
        label="Mật khẩu*"
        v-model="state.password"
        density="compact"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        required
        @blur="v$.password.$touch"
        @input="v$.password.$touch"
      ></v-text-field>

      <v-text-field
        label="Xác nhận mật khẩu*"
        v-model="state.passwordConfirmation"
        density="compact"
        :error-messages="v$.passwordConfirmation.$errors.map((e) => e.$message)"
        required
        @blur="v$.passwordConfirmation.$touch"
        @input="v$.passwordConfirmation.$touch"
      ></v-text-field>

      <div class="forgot-password text-end">
        <a href="#">Quên mật khẩu?</a>
      </div>

      <v-btn class="mx-auto mt-4" @click="v$.$validate" color="green-lighten-1">
        Đăng ký
      </v-btn>

      <div class="register text-center mt-4">
        <span>Đã có tài khoản? </span>
        <a href="#">Đăng ký</a>
      </div>
    </form>
  </v-sheet>
</template>


<script>
import { useRegister } from "./register";

export default {
  name: "RegisterView",
  setup() {
    const resource = useRegister();
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