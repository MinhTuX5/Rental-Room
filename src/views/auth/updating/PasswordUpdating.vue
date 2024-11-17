<template>
  <v-container class="post-management">
    <v-col class="pa-4">
      <v-sheet class="text-h4 mb-4">Đổi mật khẩu</v-sheet>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="model.currentPassword.value"
          :counter="20"
          :error-messages="model.currentPassword.errorMessage"
          label="Mật khẩu hiện tại"
          :append-icon="
            showPassword.currentPassword ? 'mdi-eye' : 'mdi-eye-off'
          "
          @click:append="
            showPassword.currentPassword = !showPassword.currentPassword
          "
          :rules="[rules.required, rules.min]"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="model.newPassword.value"
          :counter="20"
          :error-messages="model.newPassword.errorMessage"
          label="Mật khẩu mới"
          :append-icon="showPassword.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword.newPassword = !showPassword.newPassword"
          :rules="[rules.required, rules.min]"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="model.newPasswordConfirmation.value"
          :counter="7"
          :error-messages="model.newPasswordConfirmation.errorMessage"
          label="Xác nhận mật khẩu mới"
          :append-icon="
            showPassword.newPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
          "
          @click:append="
            showPassword.newPasswordConfirmation =
              !showPassword.newPasswordConfirmation
          "
          :rules="[rules.required, rules.min]"
          class="mb-2"
        ></v-text-field>

        <v-btn type="submit"> Cập nhật </v-btn>
      </form>
    </v-col>
  </v-container>
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