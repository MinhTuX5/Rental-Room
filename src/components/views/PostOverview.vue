<template>
  <v-sheet class="d-flex align-center border-thin mt-2 position-relative">
    <v-icon
      icon="mdi-heart"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      :color="item.loved ? 'red' : 'black'"
    ></v-icon>
    <v-col cols="4" align-self="center">
      <v-img
        aspect-ratio="1/1"
        cover
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
      ></v-img>
    </v-col>
    <v-col cols="8">
      <v-sheet
        ><a href="">{{ item.title }}</a></v-sheet
      >
      <v-sheet>{{ item.price }} đồng/tháng</v-sheet>
      <v-sheet>{{ item.area }} m²</v-sheet>
      <v-sheet>{{ item.description }}</v-sheet>
      <v-row class="mt-2" justify="space-between">
        <v-col class="mr-2" cols="3">
          <v-icon icon="$vuetify"></v-icon>
          <span>{{ item.author }}</span>
        </v-col>
        <v-col class="mr-2" cols="3">
          <v-icon icon="$vuetify"></v-icon>
          <span>{{ moment(item.posting_date).format("DD/MM/YYYY") }}</span>
        </v-col>
        <v-col>
          <v-icon icon="$vuetify" cols="6"></v-icon>
          <span>{{ item.address }}</span>
        </v-col>
      </v-row>
    </v-col>
  </v-sheet>
</template>

<script>
import moment from "moment";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      moment,
    };
  },
};
</script>