<template>
  <v-col cols="6" class="password-updating">
    <v-form v-model="form" @submit.prevent="submit">
      <v-text-field
        v-model="model.currentPassword.value"
        :counter="20"
        :min-width="minWidth"
        :error-messages="model.currentPassword.errorMessage"
        label="Mật khẩu hiện tại"
        :append-icon="showPassword.currentPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="
          showPassword.currentPassword = !showPassword.currentPassword
        "
        :rules="[rules.required]"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="model.newPassword.value"
        :counter="20"
        :min-width="minWidth"
        :error-messages="model.newPassword.errorMessage"
        label="Mật khẩu mới"
        :append-icon="showPassword.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword.newPassword = !showPassword.newPassword"
        :rules="[rules.required, rules.min]"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="model.newPasswordConfirmation.value"
        :counter="20"
        :min-width="minWidth"
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

      <v-btn type="submit" :disabled="form" color="blue"> Cập nhật </v-btn>
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