<template>
  <v-container class="d-flex flex-column h-100 expense">
    <v-card>
      <!-- bg-color="deep-purple-darken-4" -->
      <v-tabs center-active v-model="tab">
        <v-tab v-for="item in tabConfig" :key="item.value" :value="item.value">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-card>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-row>
          <v-col />
          <v-col :cols="chartCols">
            <v-sparkline
              :padding="padding"
              :auto-line-width="autoLineWidth"
              :fill="fill"
              :gradient="gradient"
              :gradient-direction="gradientDirection"
              :line-width="width"
              :model-value="value"
              :smooth="radius || false"
              :stroke-linecap="lineCap"
              :type="type"
              auto-draw
              :labels="labels"
            ></v-sparkline>
          </v-col>
          <v-col />
        </v-row>
        <v-row>
          <v-col />
          <v-col :cols="chartCols">
            <v-sparkline
              :padding="padding"
              :auto-line-width="autoLineWidth"
              :fill="fill"
              :gradient="gradient"
              :gradient-direction="gradientDirection"
              :line-width="width"
              :model-value="value"
              :smooth="radius || false"
              :stroke-linecap="lineCap"
              :type="type"
              auto-draw
              :labels="labels"
            ></v-sparkline>
          </v-col>
          <v-col />
        </v-row>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <!-- :key="roomKey" -->
        <room-expense-list
          v-if="tab === 2"
          :headers="headers"
          :searchLabel="searchLabel"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <!-- :key="personKey" -->
        <person-expense-list
          v-if="tab === 3"
          :headers="headers"
          :searchLabel="searchLabel"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
import { useExpense } from "./expense";
import RoomExpenseList from "./RoomExpenseList.vue";
import PersonExpenseList from "./PersonExpenseList.vue";

export default {
  name: "Expense",
  components: { RoomExpenseList, PersonExpenseList },
  setup() {
    const resource = useExpense();
    return resource;
  },
};
</script>

<style lang="scss">
.expense {
  g {
    text {
      font-size: 6px;
    }
  }
}
</style>