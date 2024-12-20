<template>
  <v-container class="post-management">
    <v-tabs v-model="tab" class="mb-4">
      <v-tab :value="1">Cập nhật thông tin</v-tab>
      <v-tab :value="2">Đổi mật khẩu</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-row>
          <v-col>
            <form @submit.prevent="submit">
              <v-text-field
                v-model="model.name.value"
                :counter="10"
                :error-messages="model.name.errorMessage"
                label="Tên liên hệ"
              ></v-text-field>

              <v-text-field
                v-model="model.phone.value"
                :counter="7"
                :error-messages="model.phone.errorMessage"
                label="Số điện thoại"
              ></v-text-field>

              <v-text-field
                v-model="model.email.value"
                :error-messages="model.email.errorMessage"
                label="E-mail"
              ></v-text-field>

              <!-- <v-select
              v-model="select.value.value"
              :error-messages="select.errorMessage.value"
              :items="items"
              label="Select"
            ></v-select>
    
            <v-checkbox
              v-model="checkbox.value.value"
              :error-messages="checkbox.errorMessage.value"
              label="Option"
              type="checkbox"
              value="1"
            ></v-checkbox> -->

              <v-btn class="me-4" @click="handleReset"> Hoãn </v-btn>
              <v-btn type="submit"> Cập nhật </v-btn>
            </form>
          </v-col>
          <v-col class="justify-space-between d-flex flex-column align-center">
            <v-sheet class="justify-center d-flex">
              <v-avatar
                image="https://picsum.photos/1920/1080?random"
                size="220"
              ></v-avatar>
            </v-sheet>
            <v-btn class="w-fit-content"> Đổi ảnh đại diện </v-btn>
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