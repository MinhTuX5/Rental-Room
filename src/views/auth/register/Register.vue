<template>
  <form
    class="w-auto d-flex flex-column justify-center bg-white pa-8 rounded-lg"
    @submit.prevent="register"
  >
    <div class="form-title text-h4 text-center mb-6">Đăng ký</div>

    <div class="register-message mb-4">
      <v-alert
        v-if="errorMessage"
        type="error"
        density="comfortable"
        variant="tonal"
        closable
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <v-alert
        v-else-if="successMessage"
        type="success"
        density="comfortable"
        variant="tonal"
        closable
        @click:close="successMessage = ''"
      >
        {{ successMessage }}
      </v-alert>
    </div>

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
      label="Số điện thoại/tài khoản*"
      v-model="state.account"
      density="compact"
      :error-messages="v$.account.$errors.map((e) => e.$message)"
      required
      @blur="v$.account.$touch"
      @input="v$.account.$touch"
    ></v-text-field>

    <v-select
      v-model="state.role"
      :items="registerRoles"
      item-title="label"
      item-value="value"
      label="Vai trò*"
      density="compact"
      class="mt-2"
    ></v-select>

    <v-text-field
      label="Mật khẩu*"
      v-model="state.password"
      density="compact"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
      :error-messages="v$.password.$errors.map((e) => e.$message)"
      required
      @blur="v$.password.$touch"
      @input="v$.password.$touch"
      @click:append-inner="showPassword = !showPassword"
    ></v-text-field>

    <v-btn
      class="mx-auto mt-4"
      type="submit"
      color="green-lighten-1"
      :loading="loading"
    >
      Đăng ký
    </v-btn>

    <div class="register text-center mt-4">
      <span>Đã có tài khoản? </span>
      <a href="/dang-nhap">Đăng nhập</a>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { useRegister } from "./register";

export default {
  name: "RegisterView",
  setup() {
    const resource = useRegister();
    const showPassword = ref(false);
    return { ...resource, showPassword };
  },
};
</script>

<style lang="scss" scoped>
.v-text-field {
  & + .v-text-field {
    margin-top: 8px;
  }
}

.register-message {
  min-height: 48px;

  .v-alert {
    position: static;
    width: 100%;
  }
}
</style>
