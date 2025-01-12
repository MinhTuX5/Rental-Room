<template>
  <v-container class="room-list-overview">
    <v-row>
      <v-col cols="3" v-for="(room, index) in items" :key="index">
        <v-card class="mx-auto">
          <v-img
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          ></v-img>

          <v-card-title> {{ room.room_name }} </v-card-title>

          <v-card-subtitle>
            {{
              room.member_count
                ? `Số thành viên: ${room.member_count}`
                : "Còn trống"
            }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              color="orange-lighten-2"
              text="Cập nhật"
              @click="showRoomPost(room)"
            ></v-btn>

            <v-spacer></v-spacer>

            <v-btn
              :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="show = !show"
            ></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text>
                I'm a thing. But, like most politicians, he promised more than
                he could deliver. You won't have time for sleeping, soldier, not
                with all the bed making you'll be doing. Then we'll go with that
                data file! Hey, you add a one and two zeros to that or we walk!
                You're going to do his laundry? I've got to find a way to
                escape.
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { useRoomManagementList } from "./roomListOverview";

export default {
  name: "RoomListOverview",
  setup() {
    const resource = useRoomManagementList();
    return resource;
  },
};
</script>

<style lang="scss">
.room-list-overview {
  .v-col {
    padding: 8px 4px !important;
  }
}
</style>