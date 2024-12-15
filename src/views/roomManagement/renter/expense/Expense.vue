<template>
  <v-container ref="child-container" class="d-flex flex-column h-100">
    <v-card>
      <v-tabs bg-color="deep-purple-darken-4" center-active v-model="tab">
        <v-tab v-for="item in tabConfig" :key="item.value" :value="item.value">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-card>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="i in tabConfig.length" :key="i" :value="i">
        <v-card>
          <v-card-text v-if="i != tabValues.general">
            <t-feature class="mb-2"></t-feature>
            <v-data-table
              class="flex-1-0"
              :style="{ maxHeight: contentHeight + 'px' }"
              :headers="headers"
              :items="items"
              :sticky="true"
              :fixedHeader="true"
              :fixedFooter="true"
              no-data-text="Không có dữ liệu"
              itemsPerPageText="Số dòng mỗi trang"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
import { useExpense } from "./expense";
import TFeature from "@/components/base/views/TFeature.vue";

export default {
  name: "Expense",
  components: {
    TFeature,
  },
  setup() {
    const resource = useExpense();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Expense";
</style>