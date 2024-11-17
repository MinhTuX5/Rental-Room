<template>
  <v-container class="post-management">
    <v-col class="pa-4">
      <v-sheet class="text-h4 mb-4">Cập nhật thông tin</v-sheet>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="model.name.value"
          :counter="10"
          :error-messages="model.name.errorMessage"
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="model.phone.value"
          :counter="7"
          :error-messages="model.phone.errorMessage"
          label="Phone Number"
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
  </v-container>
</template>

<script>
import { useInfoUpdating } from "./infoUpdating";

export default {
  name: "InfoUpdating",
  components: {},

  setup() {
    const resource = useInfoUpdating();
    return resource;
  },
};
</script>