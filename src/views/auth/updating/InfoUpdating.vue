<template>
  <v-container class="post-management">
    <v-tabs v-model="tab" class="mb-4">
      <v-tab :value="1">Cập nhật thông tin</v-tab>
      <v-tab :value="2">Đổi mật khẩu</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-progress-linear v-if="loading" indeterminate color="blue-lighten-1" class="mb-4"></v-progress-linear>
        <v-row>
          <v-col>
            <form @submit.prevent="submit">
              <v-text-field
                v-model="model.user_name"
                :counter="255"
                label="Tên liên hệ"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="model.phone_number"
                :counter="10"
                label="Số điện thoại chính"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="model.second_phone_number"
                :counter="10"
                label="Số điện thoại phụ"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="model.user_email"
                label="E-mail"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="model.user_facebook"
                label="Facebook"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="model.user_zalo"
                label="Zalo"
                :disabled="loading"
              ></v-text-field>

              <v-row class="d-flex justify-end mb-2 mr-4">
                <v-btn class="me-4" @click="handleReset" :disabled="loading"> Hủy </v-btn>
                <v-btn type="submit" color="blue-lighten-1" :loading="loading"> Cập nhật </v-btn>
              </v-row>
            </form>
          </v-col>
          <v-col class="d-flex flex-column align-center">
            <v-sheet class="justify-center d-flex">
              <v-avatar
                image="https://picsum.photos/1920/1080?random"
                size="220"
              ></v-avatar>
            </v-sheet>
            <v-btn class="w-fit-content mt-4" prepend-icon="mdi-camera"> Đổi ảnh đại diện </v-btn>
          </v-col>
        </v-row>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <password-updating />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
import { useInfoUpdating } from "./infoUpdating";
// components
import PasswordUpdating from "./PasswordUpdating.vue";

export default {
  name: "InfoUpdating",
  components: { PasswordUpdating },

  setup() {
    const resource = useInfoUpdating();
    return resource;
  },
};
</script>