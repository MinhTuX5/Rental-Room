<template>
  <v-col cols="6" class="password-updating">
    <v-form v-model="form" @submit.prevent="submit">
      <v-text-field
        v-model="model.currentPassword.value"
        :counter="20"
        :min-width="minWidth"
        :error-messages="model.currentPassword.errorMessage"
        label="Mật khẩu hiện tại"
        :type="showPassword.currentPassword ? 'text' : 'password'"
        :append-icon="showPassword.currentPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword.currentPassword = !showPassword.currentPassword"
        :disabled="loading"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="model.newPassword.value"
        :counter="20"
        :min-width="minWidth"
        :error-messages="model.newPassword.errorMessage"
        label="Mật khẩu mới"
        :type="showPassword.newPassword ? 'text' : 'password'"
        :append-icon="showPassword.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword.newPassword = !showPassword.newPassword"
        :disabled="loading"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="model.newPasswordConfirmation.value"
        :counter="20"
        :min-width="minWidth"
        :error-messages="model.newPasswordConfirmation.errorMessage"
        label="Xác nhận mật khẩu mới"
        :type="showPassword.newPasswordConfirmation ? 'text' : 'password'"
        :append-icon="showPassword.newPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword.newPasswordConfirmation = !showPassword.newPasswordConfirmation"
        :disabled="loading"
        class="mb-2"
      ></v-text-field>

      <v-row class="submit-btn">
        <v-btn type="submit" :loading="loading" color="blue"> Cập nhật </v-btn>
      </v-row>
    </v-form>
  </v-col>
</template>

<script>
import { usePasswordUpdating } from "./passwordUpdating";

export default {
  name: "PasswordUpdating",
  components: {},

  setup() {
    const resource = usePasswordUpdating();
    return resource;
  },
};
</script>