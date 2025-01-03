<template>
  <div class="d-flex justify-space-between">
    <v-text-field
      v-model="searchText"
      density="compact"
      append-inner-icon="mdi-magnify"
      variant="solo"
      :loading="searchLoading"
      :label="searchLabel"
      :max-width="searchMaxWidth"
      hide-details
      single-line
      @click:append-inner="$emit('search', searchText)"
      @keyup.enter="$emit('search', searchText)"
    ></v-text-field>
    <v-btn
      :prepend-icon="featureBtnConfig[featureBtnType].icon"
      color="blue-lighten-1"
      @click="$emit('on-click')"
    >
      {{ featureBtnConfig[featureBtnType].text }}
    </v-btn>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    searchLabel: {
      default: "Tìm kiếm",
      type: String,
    },
    searchMaxWidth: {
      type: Number,
      default: 300,
    },
    featureBtnType: {
      default: "add",
      type: String,
    },
  },
  setup() {
    const searchText = ref("");
    const searchLoading = ref(false);
    const onClickSearchInput = () => {
      searchLoading.value = true;
      // Simulate asynchronous search request
      setTimeout(() => {
        searchLoading.value = false;
      }, 2000); // Replace with actual search logic and delay
    };

    const featureBtnConfig = {
      add: {
        text: "Thêm mới",
        icon: "mdi-plus",
      },
      edit: {
        text: "Sửa",
        icon: "mdi-pencil",
      },
      delete: {
        text: "Xóa",
        icon: "mdi-trash-can",
      },
    };

    return {
      searchLoading,
      onClickSearchInput,
      featureBtnConfig,
      searchText,
    };
  },
};
</script>