<template>
  <div class="v-row">
    <div class="v-col v-col-4" v-for="(room, index) in items" :key="index">
      <v-card :title="room.roomName">
        <v-card-text>
          <p>Diện tích: {{ room.roomPrice }}</p>
          <p>Trạng thái: Còn trống</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { useRoomManagementList } from "./roomManagementList";

export default {
  name: "RoomManagementList",
  setup() {
    const resource = useRoomManagementList();
    return resource;
  },
};
</script>

<style lang="scss">
</style>