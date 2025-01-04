<template>
  <div class="d-flex justify-space-between align-center">
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
      v-tooltip:top="`Tìm kiếm theo ${searchLabel}`"
      @click:append-inner="$emit('search', searchText)"
      @keyup.enter="$emit('search', searchText)"
    ></v-text-field>
    <div class="d-flex">
      <v-btn
        icon="mdi-refresh"
        class="mr-4"
        density="comfortable"
        v-tooltip:top="`Tải lại trang`"
        @click="$emit('refresh')"
      />
      <v-btn
        :prepend-icon="featureBtnConfig[featureBtnType].icon"
        color="blue-lighten-1"
        :title="featureBtnConfig[featureBtnType].text"
        @click="$emit('on-click')"
      >
        {{ featureBtnConfig[featureBtnType].text }}
      </v-btn>
    </div>
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