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
import { useRoomList } from "./roomList";

export default {
  name: "RoomList",
  setup() {
    const resource = useRoomList();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./RoomList";
</style>