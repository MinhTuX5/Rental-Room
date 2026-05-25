<template>
  <v-container class="room-list-overview">
    <v-row>
      <v-col cols="3" v-for="(room, index) in items" :key="index">
        <v-card class="mx-auto">
          <v-img
            height="200px"
            :src="
              room.first_image
                ? room.first_image
                : '/src/assets/imgs/common/room.png'
            "
            :cover="room.first_image ? true : false"
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
              text="Chi tiết"
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
              <v-card class="pa-4">
                <v-row>
                  <div class="text-h6">
                    <b>Giá phòng:</b>
                    {{ formatNumberWithCommas(room.room_price) }}
                  </div>
                </v-row>
                <v-row>
                  <div class="text-h6">
                    <b>Diện tích:</b>
                    {{ formatNumberWithCommas(room.room_area) }}
                  </div>
                </v-row>
                <v-row>
                  <div class="text-h6">
                    <b>Số phòng ngủ:</b>
                    {{ room.no_of_bed_rooms }}
                  </div>
                </v-row>
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

    <v-dialog v-model="showResidentDialog" max-width="640">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Chi tiết {{ selectedRoom?.room_name }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeResidentDialog"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table v-if="residents.length">
            <thead>
              <tr>
                <th>Tên người thuê</th>
                <th>Số điện thoại</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resident in residents" :key="resident.resident_id">
                <td>{{ resident.resident_name }}</td>
                <td>{{ resident.phone_number }}</td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-center text-medium-emphasis py-6">
            Phòng chưa có người thuê
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
