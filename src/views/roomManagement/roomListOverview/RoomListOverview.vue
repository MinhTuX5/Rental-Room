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
              v-if="isShowUpdateBtn"
              color="orange-lighten-2"
              text="Cập nhật"
              @click="showRoomPost(room)"
            ></v-btn>

            <v-spacer></v-spacer>

            <v-btn
              :icon="room.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="room.show = !room.show"
            ></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="room.show">
              <v-divider></v-divider>
              <v-card class='pa-4'>
                <v-row
                  ><div class="text-h6">
                    <b>Giá phòng:</b>
                    {{ formatNumberWithCommas(room.room_price) }}
                  </div></v-row
                >
                <v-row
                  ><div class="text-h6">
                    <b>Diện tích:</b>
                    {{ formatNumberWithCommas(room.room_area) }}
                  </div></v-row
                >
                <v-row
                  ><div class="text-h6">
                    <b>Số phòng ngủ:</b>
                    {{ room.no_of_bed_rooms }}
                  </div></v-row
                >
              </v-card>
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
import { formatNumberWithCommas } from "../../../common/commonFunction";
import { useRoomManagementList } from "./roomListOverview";

export default {
  name: "RoomListOverview",
  setup() {
    const resource = useRoomManagementList();
    return { ...resource, formatNumberWithCommas };
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