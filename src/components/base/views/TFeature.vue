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
        v-if="showRefreshBtn"
        icon="mdi-refresh"
        class="mr-4"
        density="comfortable"
        v-tooltip:top="`Tải lại trang`"
        @click="$emit('refresh')"
      />
      <v-btn
        v-if="showAddBtn"
        class="cursor-pointer"
        prepend-icon="mdi-plus"
        :color="addBtnColor"
        :title="addBtnText"
        @click="$emit('on-click')"
      >
        {{ addBtnText }}
      </v-btn>
      <!-- slot -->
      <slot name="featureBtn" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "TFeature",
  props: {
    searchLabel: {
      default: "Tìm kiếm",
      type: String,
    },
    searchMaxWidth: {
      type: Number,
      default: 300,
    },
    showAddBtn: {
      default: true,
      type: Boolean,
    },
    addBtnText: {
      default: "Thêm mới",
      type: String,
    },
    addBtnColor: {
      default: "blue-lighten-1",
      type: String,
    },
    showRefreshBtn: {
      default: true,
      type: Boolean,
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

    return {
      searchLoading,
      onClickSearchInput,
      searchText,
    };
  },
};
</script>