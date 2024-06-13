<!-- tabs -->
<template>
  <v-card>
    <v-tabs fixed-tabs>
      <v-tab
        v-for="(item, index) in data"
        :key="index"
        :value="index"
        :text="item.display"
        >123</v-tab
      >
    </v-tabs>
  </v-card>
</template>
<script>
export default {
  name: "VTab",
  props: {
    /**
     * {display: ""}
     */
    data: [],
  },
};
</script>